import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service-s3',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  package: { individually: true },
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      S3_BUCKET: '${env:S3_BUCKET}'
    },
    lambdaHashingVersion: '20201221',

    iamRoleStatements:[
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: 'arn:aws:s3:::${env:S3_BUCKET}'
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::${env:S3_BUCKET}/*'
      }
    ],
  },

  resources: {
      Resources: {

        WebAppS3Bucket:{
          Type: 'AWS::S3::Bucket',
          Properties: {
            BucketName: 'auto-source-bucket1',
            CorsConfiguration:{
              CorsRules:[
                {
                    AllowedHeaders: [
                        "*"
                    ],
                    AllowedMethods: [
                        "PUT"
                    ],
                    AllowedOrigins: [
                        "*"
                    ],
                }
              ],
            } 
          },
        },
        WebAppS3BucketPolicy: {
          Type: 'AWS::S3::BucketPolicy',
          Properties: {
            Bucket: {
              Ref: 'WebAppS3Bucket'
            },
            PolicyDocument:{
              Statement:[{
                Sid: 'AllowPublicReadWrite',
                Effect: 'Allow',
                Action: ['s3:GetObject','s3:PutObject','s3:DeleteObject'],
                Resource: 'arn:aws:s3:::auto-source-bucket1/*',
                Principal: '*'
              }],
            },
          },
        },

      },
    },

  // import the function via paths
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
