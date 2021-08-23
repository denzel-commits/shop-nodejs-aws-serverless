import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { getAllProducts } from 'src/repository/products-repository';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try{
      const products = await getAllProducts();
      
      return formatJSONResponse(200, {
        products
      });
    }catch(e){
      throw new Error('Cannot get data');
    }
}

export const main = middyfy(getProductsList);
