import 'source-map-support/register';
import { Client } from 'pg';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { dbOptions } from '../../config/database-config';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
    console.log("getProductsList lambda launched");

    const client = new Client(dbOptions);
    await client.connect();
    try{

      const sql = 'SELECT a.*, b.count FROM public.products as a LEFT JOIN public.stocks as b ON b.product_id = a.id';
      const {rows: products} = await client.query(sql);
      console.log('rows: ', products);
      
      return formatJSONResponse(200, products);
    }catch(e){
      console.log("Failed to fetch data", e);
      return formatJSONResponse(500, {
        message: "failed to fetch data"
      });
    }finally{
      await client.end();
    }
}

export const main = middyfy(importProductsFile);
