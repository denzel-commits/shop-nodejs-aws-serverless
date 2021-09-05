const handler = require("../src/functions/getProductsById/handler");

const testEvent = {
  pathParameters: {
    productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
  },
};

const negativeTestEvent = {
  pathParameters: {
    productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aaF",
  },
};

test("product received is a valid object", async () => {
  const response = await handler.main(testEvent);
  const product = JSON.parse(response.body);

  expect(product).toHaveProperty("id");
  expect(product).toHaveProperty("title");
  expect(product).toHaveProperty("price");
  expect(product).toHaveProperty("count");
  expect(product).toHaveProperty("description");
});

test("correct product by id received", async () => {
  const response = await handler.main(testEvent);
  const product = JSON.parse(response.body);

  expect(product["id"]).toBe(testEvent.pathParameters.productId);
});

test("incorrect product id", async () => {
  const response = await handler.main(negativeTestEvent);
  const body = JSON.parse(response.body);

  expect(body.message).toBe("Product not found");
});
