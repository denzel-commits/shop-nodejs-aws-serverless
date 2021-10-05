import  { IProduct } from '../interfaces/product';

const products = [
    {
      "count": 4,
      "description": "Short Product Description1",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
      "price": 200,
      "title": "MARSHALL Emberton"
    },
    {
      "count": 6,
      "description": "Short Product Description3",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
      "price": 50,
      "title": "Sony SRS-XB12"
    },
    {
      "count": 7,
      "description": "Portable Bluetooth, Wireless Speaker with Microphone- Soft Black",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
      "price": 23,
      "title": "Bose SoundLink Color II"
    },
    {
      "count": 12,
      "description": "Waterproof Portable Bluetooth Speaker (Black)",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
      "price": 129,
      "title": "JBL Charge 3"
    },
    {
      "count": 7,
      "description": "Short Product Description2",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
      "price": 50,
      "title": "JBL Clip 3"
    },
    {
      "count": 8,
      "description": "Short Product Description4",
      "id": "7567ec4b-b10c-48c5-9345-fc73348a80a1",
      "price": 15,
      "title": "JBL FLIP 4"
    },
    {
      "count": 2,
      "description": "Short Product Descriptio1",
      "id": "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
      "price": 448,
      "title": "Sony SRS-XP700"
    },
    {
      "count": 3,
      "description": "Short Product Description7",
      "id": "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
      "price": 119,
      "title": "JBL FLIP 5"
    },
    {
    "count": 3,
    "description": "Short Product Description7",
    "id": "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
    "price": 119,
    "title": "JBL FLIP 5"
    }
    ];

console.log('mock product-service imported');

const getAllProducts = async ():Promise<IProduct[]> => {
    return products;
}

const findProductById = async (_client, id: string):Promise<IProduct> => {
    const product = products.find( (product) => product.id === id );

    if(!product){
        return null;
    }
  
    return product;
}

const findProductByTitle = async (_client, title: string):Promise<IProduct> => {
    const product = products.find( (product) => product.title === title );

    if(!product){
        return null;
    }
  
    return product;
}

const insertProduct = async (_client, product: IProduct):Promise<IProduct> => {

    products.push(product);

    const { title } = product;

    return await findProductByTitle(_client, title);
}

const updateProduct = async (_client, product: IProduct, id: string):Promise<IProduct> => {

    const {title, description, price, count} = product;

    const index = products.findIndex((entry) => entry.id === id);

    products[index].title = title;
    products[index].description = description;
    products[index].price = price;
    products[index].count = count;

    return product;
}

export {getAllProducts, findProductById, findProductByTitle, insertProduct, updateProduct};