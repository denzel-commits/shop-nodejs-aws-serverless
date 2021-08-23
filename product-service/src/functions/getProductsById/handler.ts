import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { findProductById } from 'src/repository/products-repository';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  
  try{
    const product = await findProductById(event.pathParameters.productId);

    if( !product ){
      return formatJSONResponse(404, {
        message: 'Product not found'
      });
    }  
  
    return formatJSONResponse(200, {
      product,
      event
    });

  }
  catch(e){
    throw new Error('Cannot get data'); // add custom errorHandler and send jsonresponse with errro and log error
  }

}

export const main = middyfy(getProductsById);
