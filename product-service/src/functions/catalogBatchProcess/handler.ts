import 'source-map-support/register';
import {Client} from 'pg';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import AWS from 'aws-sdk';
import { dbOptions } from '../../config/database-config';

const catalogBatchProcess = async (event) => {
    console.log("catalogBatchProcess lambda launched");
    console.log(event);
    const clientParams = {region: 'eu-west-1'};

    try{      
      AWS.config.update(clientParams);
      const sns = new AWS.SNS();

      const products = event.Records.map( ({body}) => body );

      event.Records.forEach( (record) => {
        console.log('messageAttributes', record.messageAttributes);
      } );

      // -- CONNECT TO DATABASE
    const client = new Client(dbOptions);
    await client.connect();

      for(const product of products){

          console.log('product', product);

          const {title, description, price, count} = JSON.parse(product);

          const selectText = 'SELECT id, title FROM public.products WHERE title = $1';
          const {rows: products} = await client.query(selectText, [title]);

          console.log('check product from db with title: ' + title + ', result = ', products);

          if(products.length){
            console.log('update product by id', products[0].id);

              // -- BEGIN TRANSACTION
              await client.query('BEGIN');
              
              const queryText = 'UPDATE public.products SET title = $1, description = $2, price = $3 WHERE id = $4';
              const res = await client.query(queryText, [title, description, price, products[0].id]);
              
              const updateStocksText = 'UPDATE public.stocks SET count = $1 WHERE product_id = $2';
              const updateStocksValues = [count, products[0].id];
              await client.query(updateStocksText, updateStocksValues);

              await client.query('COMMIT');  

          }else{
            console.log('insert new product', product);

            // -- BEGIN TRANSACTION
            await client.query('BEGIN');
            
            const queryText = 'INSERT INTO public.products(title, description, price) VALUES($1, $2, $3) RETURNING id';
            const res = await client.query(queryText, [title, description, price]);
            
            const insertStocksText = 'INSERT INTO public.stocks(product_id, count) VALUES ($1, $2)';
            const insertStocksValues = [res.rows[0].id, count];
            await client.query(insertStocksText, insertStocksValues);

            await client.query('COMMIT');  
          }

          // const query = {
          //   // give the query a unique name
          //   name: 'fetch-product',
          //   text: 'SELECT * FROM user WHERE title = $1',
          //   values: [product.title],
          // }
      }

      // send notification
      const params = {
        Subject: 'Products import finished',
        Message: JSON.stringify(products),
        TopicArn: process.env.SNS_ARN
        };

      sns.publish(params, (err) => {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Send product to SNS queue", products);
        }
      });
      
      return formatJSONResponse(200, {message: 'Products import finished'});
    }catch(e){
      console.log("Failed to import products", e);
      return formatJSONResponse(500, {
        message: "Failed to import products"
      });
    }
}

export const main = middyfy(catalogBatchProcess);
