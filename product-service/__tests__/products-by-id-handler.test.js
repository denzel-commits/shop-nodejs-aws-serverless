const handler = require("../src/functions/getProductsById/handler");

const testEvent = {
  pathParameters: {
    productId: "8e662468-583f-4acf-b752-054dde14f270",
  },
};

const negativeTestEvent = {
  pathParameters: {
    productId: "bdb7f1e4-9e7e-4973-9a03-3d0344d1abf7",
  },
};

test("product received is a valid object", async () => {
  const response = await handler.main(testEvent);
  const product = JSON.parse(response.body);
  const { statusCode } = response;

  expect(product).toHaveProperty("id");
  expect(product).toHaveProperty("title");
  expect(product).toHaveProperty("price");
  expect(product).toHaveProperty("count");
  expect(product).toHaveProperty("description");

  expect(statusCode).toBe(200);
});

test("correct product by id received", async () => {
  const response = await handler.main(testEvent);
  const product = JSON.parse(response.body);
  const { statusCode } = response;

  expect(product["id"]).toBe(testEvent.pathParameters.productId);
  expect(statusCode).toBe(200);
});

test("incorrect product id", async () => {
  const response = await handler.main(negativeTestEvent);
  const body = JSON.parse(response.body);
  const { statusCode } = response;

  expect(body.message).toBe("Product not found");
  expect(statusCode).toBe(404);
});
