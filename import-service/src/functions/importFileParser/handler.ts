import 'source-map-support/register';

import csv from 'csv-parser';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import AWS from "aws-sdk";

const BUCKET = 'shop-products-source';

const importFileParser = async (event) => {
    console.log("importFileParser lambda launched");
    console.log(event);
    const clientParams = {region: 'eu-west-1'};
    const results = [];
    const parser = csv({separator: ';'});

    try{      
      const s3 = new AWS.S3(clientParams);

      for(const record of event.Records){
        
        const s3Stream = s3.getObject({
          Bucket: BUCKET,
          Key: record.s3.object.key
        }).createReadStream();

        s3Stream
        .pipe(parser)
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          //output
          console.log(results);

          //copy to parsed
          await s3.copyObject({
            Bucket: BUCKET,
            CopySource: BUCKET + '/' + record.s3.object.key,
            Key: record.s3.object.key.replace('uploaded', 'parsed')
          }).promise();

          //delete
          await s3.deleteObject({
            Bucket: BUCKET, 
            Key: record.s3.object.key
          }).promise();

        });

      }
      
      return formatJSONResponse(200, {message: 'products parsed successfully'});
    }catch(e){
      console.log("Failed to parse data", e);
      return formatJSONResponse(500, {
        message: "Failed to parse data"
      });
    }
}

export const main = middyfy(importFileParser);
