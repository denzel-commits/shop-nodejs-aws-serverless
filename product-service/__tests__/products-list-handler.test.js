const handler = require("../src/functions/getProductsList/handler");
// import { main as handler } from "../src/functions/getProductsList/handler";

test("correct product list received", async () => {
  const response = await handler.main();
  const products = JSON.parse(response.body);

  // let's test that each item in the product data has the correct properties
  for (let i = 0; i < products.length; i += 1) {
    it(`product[${i}] should have properties (count, description, id, price, title)`, () => {
      expect(products[i]).toHaveProperty("id");
      expect(products[i]).toHaveProperty("title");
      expect(products[i]).toHaveProperty("price");
      expect(products[i]).toHaveProperty("count");
      expect(products[i]).toHaveProperty("description");
    });
  }
});
