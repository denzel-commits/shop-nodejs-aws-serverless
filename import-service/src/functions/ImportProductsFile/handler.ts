import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import AWS from "aws-sdk";

import '../../config/config';

const BUCKET = process.env.S3_BUCKET;

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log("importProductsFile lambda launched");
    console.log(event);

    const fileName = event.queryStringParameters.name;

    const clientParams = {region: 'eu-west-1'};

    try{      
      const putObjectParams = {Bucket: BUCKET, Key: `uploaded/${fileName}`};

      const client = new S3Client(clientParams);
      const command = new PutObjectCommand(putObjectParams);
      const url = await getSignedUrl(client, command, { expiresIn: 3600 });

      // const s3 = new AWS.S3(clientParams);
      // const params = {Bucket: BUCKET, Key: `uploaded/${fileName}`};
      // const url = s3.getSignedUrl('getObject', params);
      console.log('The URL is', url);
      
      return formatJSONResponse(200, {url});
    }catch(e){
      console.log("Failed to import data", e);
      return formatJSONResponse(500, {
        message: "Failed to import data"
      });
    }
}

export const main = middyfy(importProductsFile);
