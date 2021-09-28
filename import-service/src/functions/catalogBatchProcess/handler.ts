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
      // const sns = new AWS.SNS();

      const products = event.Records.map( ({body}) => body );

      // update DB with batch of products

      // send notification to SNS on completion
        
      console.log(products); 
      
      return formatJSONResponse(200, {message: 'Products imported in DB successfully'});
    }catch(e){
      console.log("Failed to import products", e);
      return formatJSONResponse(500, {
        message: "Failed to import products"
      });
    }
}

export const main = middyfy(catalogBatchProcess);
