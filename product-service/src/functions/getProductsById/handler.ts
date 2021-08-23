import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
// import { middyfy } from '../../libs/lambda';

import schema from './schema';
import { findProductById } from '../../repository/products-repository';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  
  try{
    const product = await findProductById(event.pathParameters.productId);
    if( !product ){
      return formatJSONResponse(404, {
        message: 'Product not found'
      });
    }  
  
    return formatJSONResponse(200, {
      product
    });

  }
  catch(e){
    return formatJSONResponse(500, {
      message: "failed to fetch data"
    });
  }

}

// export const main = middyfy(getProductsById);
export const main = getProductsById;