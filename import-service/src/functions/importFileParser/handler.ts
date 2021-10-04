import 'source-map-support/register';

import csv from 'csv-parser';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import AWS from 'aws-sdk';
import '../../config/config';

const BUCKET = process.env.S3_BUCKET;
const SQS_URL = process.env.SQS_URL;

const importFileParser = async (event) => {
    console.log("importFileParser lambda launched");
    console.log(event);
    const clientParams = {region: 'eu-west-1'};
    const parser = csv({separator: ';'});

    try{      
      AWS.config.update(clientParams);
      const s3 = new AWS.S3();
      const sqs = new AWS.SQS();

      for(const record of event.Records){
        
        const s3Stream = s3.getObject({
          Bucket: BUCKET,
          Key: record.s3.object.key
        }).createReadStream();

        s3Stream
        .pipe(parser)
        .on('data', (data) => {
          //output
          console.log(data);

          //send to sqs queue
          const params = { 
            MessageAttributes: {
              "price": {
                DataType: "Number",
                StringValue: data.price
              }
            },
            MessageBody: JSON.stringify(data),
            QueueUrl: SQS_URL, 
          // DelaySeconds: 10,
          };

          sqs.sendMessage(params, (err, data) => {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data);
            }
          });

        })
        .on('end', async () => {
         //copy to parsed
          await s3.copyObject({
            Bucket: BUCKET,
            CopySource: BUCKET + '/' + record.s3.object.key,
            Key: record.s3.object.key.replace('uploaded', 'parsed')
          }).promise();

          //delete original
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
