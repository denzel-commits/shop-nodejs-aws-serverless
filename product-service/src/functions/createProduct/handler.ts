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
    console.log("Parameters", event.body);

    const {title, description, price, count} = event.body;

    // -- CONNECT TO DATABASE
    const client = new Client(dbOptions);
    await client.connect();
    
    // -- BEGIN TRANSACTION
    try {
      await client.query('BEGIN');
      
      const queryText = 'INSERT INTO public.products(title, description, price) VALUES($1, $2, $3) RETURNING id';
      const res = await client.query(queryText, [title, description, price]);
      const insertStocksText = 'INSERT INTO public.stocks(product_id, count) VALUES ($1, $2)';
      const insertStocksValues = [res.rows[0].id, count];
      await client.query(insertStocksText, insertStocksValues);
      
      await client.query('COMMIT');    

      event.body.id = res.rows[0].id;
        
      return formatJSONResponse(200, event.body);
    } catch (e) {
      await client.query('ROLLBACK');
      console.log("ROLLBACK - Failed to add new product", e);
      return formatJSONResponse(500, {
        message: "ROLLBACK - failed to add new product"
      });
    } finally {
      client.end();
    }
}

export const main = middyfy(createProduct);
