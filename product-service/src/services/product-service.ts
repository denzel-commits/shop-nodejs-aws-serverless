import  { IProduct } from '../interfaces/product';

console.log('product-service imported');

const getAllProducts = async ():Promise<IProduct[]> => {
    return products;
}

const findProductById = async (client, id: string):Promise<IProduct | null> => {

    const selectText = 'SELECT * FROM public.products WHERE id = $1';
    const {rows: products} = await client.query(selectText, [id]);

    if(!products.length){
        return null;
    }
  
    return products[0];
}

const findProductByTitle = async (client, title: string):Promise<IProduct | null> => {

    const selectText = 'SELECT * FROM public.products WHERE title = $1';
    const {rows: products} = await client.query(selectText, [title]);

    if(!products.length){
        return null;
    }
  
    return products[0];
}

const insertProduct = async (client, product: IProduct):Promise<string> => {

    const {title, description, price, count} = product;

    // -- BEGIN TRANSACTION
    await client.query('BEGIN');

    const queryText = 'INSERT INTO public.products(title, description, price) VALUES($1, $2, $3) RETURNING id';
    const res = await client.query(queryText, [title, description, price]);
    
    const insertStocksText = 'INSERT INTO public.stocks(product_id, count) VALUES ($1, $2)';
    const insertStocksValues = [res.rows[0].id, count];
    await client.query(insertStocksText, insertStocksValues);

    await client.query('COMMIT');  

    return res.rows[0].id;
}

const updateProduct = async (client, product: IProduct, id: string):Promise<string> => {

    const {title, description, price, count} = product;
 
    // -- BEGIN TRANSACTION
    await client.query('BEGIN');

    const queryText = 'UPDATE public.products SET title = $1, description = $2, price = $3 WHERE id = $4';
    const res = await client.query(queryText, [title, description, price, id]);

    const updateStocksText = 'UPDATE public.stocks SET count = $1 WHERE product_id = $2';
    const updateStocksValues = [count, id];
    await client.query(updateStocksText, updateStocksValues);

    await client.query('COMMIT');  

    return id;
}

export {getAllProducts, findProductById, findProductByTitle, insertProduct, updateProduct};