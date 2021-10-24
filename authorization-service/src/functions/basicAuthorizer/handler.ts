import 'source-map-support/register';

import {/*APIGatewayAuthorizerHandler,*/ APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent} from 'aws-lambda';
import { middyfy } from '@libs/lambda';

const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent, _context, callback) => {

  console.log('Auth event', event);

  if(event.type != 'TOKEN'){
    callback("Unauthorized");
  }

  try{
    // get creds from token
    const authorizationToken = event.authorizationToken;

    const encodedCreds = authorizationToken.split(' ')[1];
    
    // decode creds
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');
    const username = plainCreds[0];
    const password = plainCreds[1];

    // create policy
    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

    console.log('effect', effect);

    const policy = generateAimPolicy(encodedCreds, event.methodArn, effect);

    callback(null, policy);
  }catch(e){
    callback("Unauthorized " + e.message);
  }

}

function generateAimPolicy(principalId: string, resource, effect = 'Deny'): APIGatewayAuthorizerResult{
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        },
      ],
    }
  }
}

export const main = middyfy(basicAuthorizer);
