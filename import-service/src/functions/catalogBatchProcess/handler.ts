import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import AWS from 'aws-sdk';
import '../../config/config';

const catalogBatchProcess = async (event) => {
    console.log("catalogBatchProcess lambda launched");
    console.log(event);
    const clientParams = {region: 'eu-west-1'};

    try{      
      AWS.config.update(clientParams);
      // const sns = new AWS.SNS();

      const products = event.Records.map( ({body}) => body );

      // update DB with products

      // send notification to SNS on completion
        
      console.log(products); 
      
      return formatJSONResponse(200, {message: 'products parsed successfully'});
    }catch(e){
      console.log("Failed to parse data", e);
      return formatJSONResponse(500, {
        message: "Failed to parse data"
      });
    }
}

export const main = middyfy(catalogBatchProcess);
