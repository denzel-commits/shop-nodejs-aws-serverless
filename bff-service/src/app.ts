import express from 'express';
import axios, { Method } from 'axios';

const app = express();

app.use(express.json());

// app.use(loggerMiddleware);

app.all('/*', async (req, res, next) => {
    console.log('originalUrl', req.originalUrl);
    console.log('method', req.method);
    console.log('body', req.body);

    // test data
    const endpoints = {
        'cart': 'http://denzel-commits-cart-api-dev-eb.eu-west-1.elasticbeanstalk.com/api', 
        'products': 'https://845z6apvdh.execute-api.eu-west-1.amazonaws.com/dev'
    };
    const recipients = new Map<string, string>(Object.entries(endpoints));


    const {originalUrl, body} = req;
    const recipient = originalUrl && originalUrl.split('/')[1];
    
    // const recipientUrl = recipient && process.env[recipient];
    const recipientUrl = recipient && recipients.get(recipient);

    console.log('recipient', `${recipientUrl}${req.originalUrl}`);

    if(recipientUrl){

        try {
            const axiosConfig = {
                method: req.method as Method,
                url: `${recipientUrl}${req.originalUrl}`,
                ...((Object.keys(body) || {}).length > 0 && {data: body})
            };

            const response = await axios(axiosConfig);

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

// app.use(errorMiddleware);

export { app };