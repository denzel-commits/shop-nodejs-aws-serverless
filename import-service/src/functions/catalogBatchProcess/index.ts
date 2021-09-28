import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`, 
  events: [
    {
    sqs: {
      batchSize: 10,
      arn: {
        'Fn::GetAtt': ['SQSQueue', 'Arn']
      },
    }
    }
  ],
  environment: {
    PG_HOST: '${env:PG_HOST}',
    PG_PORT: '${env:PG_PORT}',
    PG_DBNAME: '${env:PG_DBNAME}',
    PG_USERNAME: '${env:PG_USERNAME}',
    PG_PASSWORD: '${env:PG_PASSWORD}'
  },
}