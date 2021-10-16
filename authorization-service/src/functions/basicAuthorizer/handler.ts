import 'source-map-support/register';

// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

// import schema from './schema';

const basicAuthorizer = async (event, _context, callback) => {

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

const generateAimPolicy = (principalId, resource, effect = 'Allow') => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }
    }
  }
}

export const main = middyfy(basicAuthorizer);
