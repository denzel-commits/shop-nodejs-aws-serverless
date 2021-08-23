import products from './mock-products.json';


const getAllProducts = async () => {

    return products;
}

const findProductById = async (slug: string) => {
    const product = products.find( (product) => product.id === slug );
  
    if(!product){
        return null;
    }
  
    return product;
}

export {getAllProducts, findProductById};