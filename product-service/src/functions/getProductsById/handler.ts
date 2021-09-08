import 'source-map-support/register';
import {Client} from 'pg';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { dbOptions } from '../../config/database-config';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log("getProductsById lambda launched with event: ", event);
  console.log("Product Id: ", event.pathParameters.productId);

  if( !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(event.pathParameters.productId) ){
    console.log("Invalid v4 UUID provided");

    return formatJSONResponse(500, {
      message: "Invalid v4 UUID provided"
    });
  }

  const client = new Client(dbOptions);
  await client.connect();
  
  try{

    const sql = 'SELECT a.*, b.count FROM public.products as a \
                 LEFT JOIN public.stocks as b ON b.product_id = a.id \
                 WHERE a.id = $1';

    const {rows: product} = await client.query(sql, [event.pathParameters.productId]);
    console.log('rows: ', product);

    if( !product.length ){
      return formatJSONResponse(404, {
        message: 'Product not found'
      });
    }  
  
    return formatJSONResponse(200, product);

  }
  catch(e){
    console.log("Failed to fetch data: ", e);
    return formatJSONResponse(500, {
      message: "failed to fetch data"
    });
  }

}

export const main = middyfy(getProductsById);