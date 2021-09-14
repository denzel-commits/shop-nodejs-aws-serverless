import 'source-map-support/register';
import { Client } from 'pg';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { dbOptions } from '../../config/database-config';
import { HTTP_STATUS_CODES } from '../../utils/constants';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
    console.log("getProductsList lambda launched");

    const client = new Client(dbOptions);
    await client.connect();
    try{

      const sql = 'SELECT a.*, b.count FROM public.products as a LEFT JOIN public.stocks as b ON b.product_id = a.id';
      const {rows: products} = await client.query(sql);
      console.log('rows: ', products);
      
      return formatJSONResponse(HTTP_STATUS_CODES.OK, products);
    }catch(e){
      console.log("Failed to fetch data", e);
      return formatJSONResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, {
        message: "failed to fetch data"
      });
    }finally{
      await client.end();
    }
}

export const main = middyfy(getProductsList);
