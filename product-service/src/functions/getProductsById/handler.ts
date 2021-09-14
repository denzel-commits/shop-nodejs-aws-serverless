import 'source-map-support/register';
import {Client} from 'pg';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { dbOptions } from '../../config/database-config';
import { HTTP_STATUS_CODES, UUID_V4_REGEX } from '../../utils/constants';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log("getProductsById lambda launched with event: ", event);
  console.log("Product Id: ", event.pathParameters.productId);

  if( !UUID_V4_REGEX.test(event.pathParameters.productId) ){
    console.log("Invalid v4 UUID provided");

    return formatJSONResponse(HTTP_STATUS_CODES.BAD_REQUEST, {
      message: "Invalid v4 UUID provided"
    });
  }

  const client = new Client(dbOptions);
  await client.connect();
  
  try{

    const sql = 'SELECT a.*, b.count FROM public.products as a \
                 LEFT JOIN public.stocks as b ON b.product_id = a.id \
                 WHERE a.id = $1';

    const {rows: products} = await client.query(sql, [event.pathParameters.productId]);
    console.log('rows[0]: ', products[0]);

    if( !products.length ){
      return formatJSONResponse(HTTP_STATUS_CODES.NOT_FOUND, {
        message: 'Product not found'
      });
    }  
  
    return formatJSONResponse(HTTP_STATUS_CODES.OK, products[0]);

  }
  catch(e){
    console.log("Failed to fetch data: ", e);
    return formatJSONResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, {
      message: "failed to fetch data"
    });
  }finally{
    await client.end();
  }

}

export const main = middyfy(getProductsById);