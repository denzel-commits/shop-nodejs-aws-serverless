import 'source-map-support/register';
import {Client} from 'pg';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
// import { getAllProducts } from '../../repository/products-repository';

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

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
    console.log("getProductsList lambda launched");

    const client = new Client(dbOptions);
    await client.connect();
    console.log('type: ', typeof(client));
    try{
      
      // const products = await getAllProducts();
      const sql = 'SELECT a.*, b.count FROM public.products as a LEFT JOIN public.stocks as b ON b.product_id = a.id';
      const {rows: products} = await client.query(sql);
      console.log('rows: ', products);
      
      return formatJSONResponse(200, products);
    }catch(e){
      console.log("Failed to fetch data", e);
      return formatJSONResponse(500, {
        message: "failed to fetch data"
      });
    }finally{
      client.end();
    }
}

export const main = middyfy(getProductsList);
