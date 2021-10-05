const getAllProducts = async ():Promise<IProduct[]> => {
    return products;
}

const findProductById = async (slug: string):Promise<IProduct> => {
    const product = products.find( (product) => product.id === slug );

    if(!product){
        return null;
    }
  
    return product;
}

const findProductByTitle = async (slug: string):Promise<IProduct> => {
    const product = products.find( (product) => product.id === slug );

    if(!product){
        return null;
    }
  
    return product;
}

const insertProduct = async (client, product: IProduct):Promise<IProduct[]> => {

    const {title, description, price, count} = product;

    // -- BEGIN TRANSACTION
    await client.query('BEGIN');

    const queryText = 'INSERT INTO public.products(title, description, price) VALUES($1, $2, $3) RETURNING id';
    const res = await client.query(queryText, [title, description, price]);
    
    const insertStocksText = 'INSERT INTO public.stocks(product_id, count) VALUES ($1, $2)';
    const insertStocksValues = [res.rows[0].id, count];
    await client.query(insertStocksText, insertStocksValues);

    await client.query('COMMIT');  

    return res;
}

const updateProduct = async (client, product: IProduct):Promise<IProduct[]> => {

    const {title, description, price, count} = product;

    // -- BEGIN TRANSACTION
    await client.query('BEGIN');

    const queryText = 'UPDATE public.products SET title = $1, description = $2, price = $3 WHERE id = $4';
    const res = await client.query(queryText, [title, description, price, products[0].id]);

    const updateStocksText = 'UPDATE public.stocks SET count = $1 WHERE product_id = $2';
    const updateStocksValues = [count, products[0].id];
    await client.query(updateStocksText, updateStocksValues);

    await client.query('COMMIT');  

    return res;
}

export {getAllProducts, findProductById, insertProducts, updateProducts};