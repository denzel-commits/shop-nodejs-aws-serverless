import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { getAllProducts } from '../../repository/products-repository';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
    console.log("getProductsList lambda launched with event: ", event);
    try{
      const products = await getAllProducts();
      
      return formatJSONResponse(200, products);
    }catch(e){
      console.log("Failed to fetch data", e);
      return formatJSONResponse(500, {
        message: "failed to fetch data"
      });
    }
}

export const main = middyfy(getProductsList);
