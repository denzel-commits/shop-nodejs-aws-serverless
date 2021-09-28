import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
    s3: {
      bucket: '${env:S3_BUCKET}',
      event: 's3:ObjectCreated:*',
      rules: [
        { prefix: 'uploaded/' }, 
        { suffix: '.csv' }
      ],
      existing: true
    }
    }
  ]
}