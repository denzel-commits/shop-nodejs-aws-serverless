import '../config/config';

export const productService = (process.env.NODE_ENV === 'test') ?
    require('./product-service-mock.ts') :
    require('./product-service.ts');

