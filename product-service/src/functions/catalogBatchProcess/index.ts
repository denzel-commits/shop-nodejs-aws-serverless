import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`, 
  events: [
    {
      sqs: {
        BatchSize: parseInt('${env:SQS_QUEUE_BATCH_SIZE}'),
        arn: {
          'Fn::ImportValue': '${self:provider.stage}-sqs-queue-arn'
        },
      }
    }
  ],
}