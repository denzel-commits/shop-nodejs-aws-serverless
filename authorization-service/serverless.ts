import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basicAuthorizer';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
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
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { basicAuthorizer },

  resources:{
      Outputs:{
        basicAuthorizerLambdaFunctionQualifiedArn:{
          Value:{
            'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn']
          },
          Export: {
            Name: '${self:provider.stage}-basicAuthorizerLambdaFunctionQualifiedArn'
          }
        }
      },
  }
};


module.exports = serverlessConfiguration;
