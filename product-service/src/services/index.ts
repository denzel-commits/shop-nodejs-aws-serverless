import '../config/config';

export const findProductByTitle = (process.env.NODE_ENV === 'test') ?
    require('./product-service-mock.ts').findProductByTitle:
    require('./product-service.ts').findProductByTitle;

export const updateProduct = (process.env.NODE_ENV === 'test') ?
    require('./product-service-mock.ts').updateProduct:
    require('./product-service.ts').updateProduct;

export const insertProduct = (process.env.NODE_ENV === 'test') ?
    require('./product-service-mock.ts').insertProduct:
    require('./product-service.ts').insertProduct;
