import express from 'express';

const app = express();

app.use(express.json());

// app.use(loggerMiddleware);

app.all('/*', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

// app.use(errorMiddleware);

export { app };