import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`, 
  events: [
    {
      sqs: {
        batchSize: parseInt('${env:SQS_QUEUE_BATCH_SIZE}'),
        arn: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        },
      }
    }
  ],
}