import 'source-map-support/register';
import {Client} from 'pg';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { dbOptions } from '../../config/database-config';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log("createProduct lambda launched");
    console.log("Parameters", event.body);

    if(typeof(event.body) === "string"){
      return formatJSONResponse(415, {
        message: `Unsupported media type Content-Type: ${event.headers["Content-Type"]}. Please provide Content-Type: application/json.`,
        event
      });

      // event.body = JSON.parse(event.body);
    }  

    const {title, description, price, count} = event.body;

    // -- VALIDATE INPUT DATA

      // // exists
      // if(title === undefined || description === undefined || price === undefined || count === undefined ){
      //   return formatJSONResponse(400, {
      //     message: 'Product data is invalid. Missing one or more properties. Example: {"title": "title", "description": "desc", "price": 100, "count": 40}',
      //     body: event.body
      //   });
      // }
      
      // // wrong type (string, int)
      // if( typeof(title) !== 'string' || typeof(description) !== 'string' || typeof(price) !== 'number' || typeof(count) !== 'number' ){
      //   return formatJSONResponse(400, {
      //     message: "Product data is invalid. Invalid property type.",
      //     body: event.body
      //   });
      // }

      // // not empty
      // if(title === '' || description === '' ){
      //   return formatJSONResponse(400, {
      //     message: 'Product data is invalid. Title and description must be not empty strings.',
      //     body: event.body
      //   });
      // }

      // // incorrect values (negative price or count)
      // if( price < 0 || count < 0 ){
      //   return formatJSONResponse(400, {
      //     message: "Product data is invalid. Price and count must be positive integer values.",
      //     body: event.body
      //   });
      // }

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
      await client.end();
    }
}

export const main = middyfy(createProduct);
