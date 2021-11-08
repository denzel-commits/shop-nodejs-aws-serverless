import express from 'express';
import axios, { Method } from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import NodeCache from 'node-cache';

import { Headers } from './interfaces/headers';

const DIR_NAME =  path.resolve(path.dirname(''));

dotenv.config({
  path: path.join(DIR_NAME, './.env.eb'),
});

const productsCache = new NodeCache( { stdTTL: 120, checkperiod: 120 } );

const app = express();

app.use(express.json());

app.all('/*', async (req, res, next) => {
    console.log('originalUrl', req.originalUrl);
    console.log('method', req.method);
    console.log('body', req.body);
    console.log('headers', req.headers);

    const {originalUrl, body} = req;
    const recipient = originalUrl && originalUrl.split('/')[1];
    
    const recipientUrl = recipient && process.env[recipient];

    console.log('recipient', `${recipientUrl}${req.originalUrl}`);

    if(recipientUrl){        
        
        const productsList = (recipient === 'products') ? productsCache.get( "productsList" ):{};

        if (recipient === 'products') req.headers = {};
        if ( productsList && recipient === 'products' ){
            console.log('Use cache', productsList);
            res.send(productsList);
        }
        else
        try {
            const axiosConfig = {
                method: req.method as Method,
                url: `${recipientUrl}${req.originalUrl}`,
                headers: req.headers as Headers,
                ...((Object.keys(body) || {}).length > 0 && {data: body})
            };

            const response = await axios(axiosConfig);

            if(response.data && recipient === 'products') {
                console.log('Set cache');
                productsCache.set( "productsList", response.data );
            }   

            console.log('Response from recipient', response.data);
            res.send(response.data);

        } catch (error) {

            console.log('Recipient request failed', JSON.stringify(error));

            if(error.response){
                const {status, data} = error.response;

                res.status(status).json(data);
            }else{
                res.status(500).json({error: error.message});
            }
            
        }

    }else{
        res.status(502).json({error: 'Cannot process request'});
    }

  next();
});

export { app };