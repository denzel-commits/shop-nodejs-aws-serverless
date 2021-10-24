import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        authorizer:{
          name: 'autoBasicAuthorizer',
          type: 'TOKEN',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          arn: {
            'Fn::ImportValue': '${self:provider.stage}-basicAuthorizerLambdaFunctionQualifiedArn'
          }
        }
      }
    }
  ]
}
