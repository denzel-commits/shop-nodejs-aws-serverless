import type { AWS } from '@serverless/typescript';

// import {getProductsList, getProductsById} from './src/functions';
import {getProductsList, getProductsById, createProduct, catalogBatchProcess } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service-rds',
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
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: '${env:PG_HOST}',
      PG_PORT: '${env:PG_PORT}',
      PG_DBNAME: '${env:PG_DBNAME}',
      PG_USERNAME: '${env:PG_USERNAME}',
      PG_PASSWORD: '${env:PG_PASSWORD}',
      SNS_ARN: {Ref: 'SNSTopic'},
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements:[
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {       
          'Fn::ImportValue': '${self:provider.stage}-sqs-queue-arn'
        },  
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {       
          'Ref': 'SNSTopic'
        },  
      },      
    ],
  },
  resources:{
    Resources:{
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: '${env:SNS_TOPIC}',
        }
      },
      SNSSubscription:{
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:SNS_ENDPOINT_EMAIL_ALT}',
          Protocol: 'email',
          TopicArn:{
            Ref: 'SNSTopic'
          },
          FilterPolicy:{
            "price": [
              {
                "numeric": [
                  ">=",
                  100
                ]
              }
            ]
          }
        }
      },
      SNSSubscriptionAlt:{
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:SNS_ENDPOINT_EMAIL}',
          Protocol: 'email',
          TopicArn:{
            Ref: 'SNSTopic'
          }
        }
      },
    }
  },
  
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess }
  
};

module.exports = serverlessConfiguration;
