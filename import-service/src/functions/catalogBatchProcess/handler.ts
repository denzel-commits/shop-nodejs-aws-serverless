import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import AWS from 'aws-sdk';
import '../../config/config';
import { dbOptions } from '../../config/database-config';

const catalogBatchProcess = async (event) => {
    console.log("catalogBatchProcess lambda launched");
    console.log(event);
    const clientParams = {region: 'eu-west-1'};

    try{      
      AWS.config.update(clientParams);
      const sns = new AWS.SNS();

      const products = event.Records.map( ({body}) => body );

      for(const product of products){

          const {title, price, count} = JSON.parse(product);
          console.log('product', product);

          // const query = {
          //   // give the query a unique name
          //   name: 'fetch-product',
          //   text: 'SELECT * FROM user WHERE title = $1',
          //   values: [product.title],
          // }
          
          // const {rows: products} = await client.query(sql);
          // console.log('rows: ', products);

          // if(products){
          //   // update
          //   console.log('update: ', products);
          // }else{
          //   //insert
          //   console.log('insert: ', products);
          // }

          // send notification
          const params = {
            Subject: 'Products import done',
            Message: JSON.stringify(products),
            TopicArn: process.env.SNS_ARN
            };

          sns.publish(params, (err) => {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Import products", products);
            }
          });

          console.log('params', params);
          console.log(products); 
      }
      
      return formatJSONResponse(200, {message: 'Products imported in DB successfully'});
    }catch(e){
      console.log("Failed to import products", e);
      return formatJSONResponse(500, {
        message: "Failed to import products"
      });
    }
}

export const main = middyfy(catalogBatchProcess);
