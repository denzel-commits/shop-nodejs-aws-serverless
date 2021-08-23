const handler = require("../src/functions/getProductsById/handler");

test("correct product by id received", async () => {
  const testEvent = {
    pathParameters: {
      productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    },
  };

  const response = await handler.main(testEvent);
  const body = JSON.parse(response.body);
  const product = body.product;

  expect(product).toHaveProperty("id");
  expect(product).toHaveProperty("title");
  expect(product).toHaveProperty("price");
  expect(product).toHaveProperty("count");
  expect(product).toHaveProperty("description");
});
