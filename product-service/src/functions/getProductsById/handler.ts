import 'source-map-support/register';
import {Client} from 'pg';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
// import { findProductById } from '../../repository/products-repository';

const {PG_HOST, PG_PORT, PG_DBNAME, PG_USERNAME, PG_PASSWORD} = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DBNAME,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl:{
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
};

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log("getProductsById lambda launched with event: ", event);
  console.log("Product Id: ", event.pathParameters.productId);

  // /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i - all versions
  if( !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(event.pathParameters.productId) ){
    console.log("Invalid v4 UUID provided");

    return formatJSONResponse(500, {
      message: "Invalid v4 UUID provided"
    });
  }

  const client = new Client(dbOptions);
  await client.connect();
  
  try{

    const sql = `SELECT a.*, b.count FROM public.products as a \
                 LEFT JOIN public.stocks as b ON b.product_id = a.id \
                 WHERE a.id = '${event.pathParameters.productId}'`;

    const {rows: product} = await client.query(sql);
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