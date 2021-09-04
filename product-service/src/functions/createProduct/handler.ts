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

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log("createProduct lambda launched");

    const {title, description, price, count} = event.body;

    const client = new Client(dbOptions);
    await client.connect();
    try{

      let sql = 'SELECT title FROM public.products WHERE title = $1'; // INSERT or UPDATE if exists
      let result = await client.query(sql, [title]);

      if(result){
        return formatJSONResponse(500, {
          message: "Product with such title already exists"
        });
      }
     
      let sql = 'INSERT INTO public.products (title, description, price) VALUES ($1, $2, $3) RETURNING id'; // INSERT or UPDATE if exists
      let result = await client.query(sql, [title, description, price]);

      const newlyCreatedProductId = result.rows[0].id;

      sql = 'INSERT INTO public.stocks (product_id, count) VALUES ($1, $2)';
      result = await client.query(sql, [newlyCreatedProductId, count]);
      
      return formatJSONResponse(200, result);
    }catch(e){
      console.log("Failed to fetch data", e);
      return formatJSONResponse(500, {
        message: "failed to fetch data"
      });
    }finally{
      client.end();
    }
}

export const main = middyfy(createProduct);
