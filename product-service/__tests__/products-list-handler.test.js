const handler = require("../src/functions/getProductsList/handler");

describe("the products data is correct", () => {
  test("test that each item in the product data has the correct properties", async () => {
    const response = await handler.main();
    const products = JSON.parse(response.body);

    for (let i = 0; i < products.length; i += 1) {
      expect(products[i]).toHaveProperty("id");
      expect(products[i]).toHaveProperty("title");
      expect(products[i]).toHaveProperty("price");
      expect(products[i]).toHaveProperty("count");
      expect(products[i]).toHaveProperty("description");
    }
  });
});
