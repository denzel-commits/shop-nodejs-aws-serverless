import type { AWS } from '@serverless/typescript';

// import {hello, getProductsList, getProductsById} from './src/functions';
import {hello, getProductsList, getProductsById} from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service-rds',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  package: { individually: true },
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
      PG_HOST: '${env:PG_HOSTNAME}',
      PG_PORT: '${env:PG_PORT}',
      PG_DBNAME: '${env:PG_DBNAME}',
      PG_USERNAME: '${env:PG_USERNAME}',
      PG_PASSWORD: '${env:PG_PASSWORD}'
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { hello, getProductsList, getProductsById }
  
};

module.exports = serverlessConfiguration;
