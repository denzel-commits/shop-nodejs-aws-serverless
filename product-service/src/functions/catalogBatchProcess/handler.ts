import 'source-map-support/register';
import { Client } from 'pg';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import AWS from 'aws-sdk';

import { dbOptions } from '../../config/database-config';
import { findProductByTitle, updateProduct, insertProduct } from '../../services/index';

const catalogBatchProcess = async (event) => {
    console.log("catalogBatchProcess lambda launched");
    console.log(event);
    const clientParams = {region: 'eu-west-1'};

    try{      
      AWS.config.update(clientParams);
      const sns = new AWS.SNS();

      const products = event.Records.map( ({body}) => JSON.parse(body) );

      event.Records.forEach( (record) => {
        console.log('messageAttributes', record.messageAttributes);
      } );

    // -- CONNECT TO DATABASE
    let client;
    if(process.env.NODE_ENV !== 'test'){
      client = new Client(dbOptions);
      await client.connect();
    }else{
      client = undefined;
    }

      for(const product of products){

          console.log('product', product);

          const { title } = product;
          const foundProduct = await findProductByTitle(client, title);

          console.log('check product from repository with title: ' + title + ', result = ', foundProduct);

          if(foundProduct){
            console.log('update product by id', foundProduct.id);
            await updateProduct(client, product, foundProduct.id);
          }else{
            console.log('insert new product', product);
            await insertProduct(client, product);
          }

          if(process.env.NODE_ENV !== 'test'){
            // send notification
            const params = {
              Subject: 'Products import finished',
              Message: JSON.stringify(product),
              TopicArn: process.env.SNS_ARN
              };
  
            sns.publish(params, (err) => {
              if (err) {
                console.log("Error", err);
              } else {
                console.log("Send product to SNS queue", product);
              }
            });
        }
      }
      
      return formatJSONResponse(200, {message: 'Products import finished'});
    }catch(e){
      console.log("Failed to import products", e);
      return formatJSONResponse(500, {
        message: "Failed to import products"
      });
    }
}

export const main = middyfy(catalogBatchProcess);
