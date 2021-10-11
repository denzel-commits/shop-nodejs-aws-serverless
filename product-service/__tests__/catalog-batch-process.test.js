const handler = require("../src/functions/catalogBatchProcess/handler");

const sqsTestEvent = {
  Records: [
    {
      messageId: "d464b98a-b3a1-4898-a796-469c8458eacc",
      receiptHandle:
        "AQEBz8uqznVe3kq0HEDe79wUtVYiIAYlzhMl9bRGTvMtoEvsT6tMsGuil3BDlhhQwU56MXAI4p9AYYoNnYR/89rS6dhZIDj5B3UUaX/goXn/sD8DjqCtpo3pTbCTfnMzWiStBPyNlFhlh6ZQL2m1ROVMa1XxU2q8kD5b7Poms/f/+DhwNyq+yloYnCGqsb4tdIGKh2oiK+kMgCUVi38QWZl0eG9EHmdd9NNxh5AU8BBFjiStd6CenuM02kskmtyYjT98zyXnlV6FQaxL/AOCNc/dAm0GQRpkTYMEL5jHtPcb8suFK0ssfbDEc1DLrsjRbot0Sb2ewoK+mtibZ75MvWDR1hCAKGKwxChvW2T8wapwhacOGSgJhLUZMCgvctS9YO5HzG+Qx6CExxOUazgnHAM9ZQ==",
      body: '{"title":"MARSHALL Emberton","description":"Short Product Description","price":"210","count":"15"}',
      attributes: {},
      messageAttributes: {},
      md5OfMessageAttributes: "7edd256ec184cdca0a43252eaafe1dae",
      md5OfBody: "ddf4c33dcacf81ca1a6b6621c4c2213b",
      eventSource: "aws:sqs",
      eventSourceARN: "arn:aws:sqs:eu-west-1:546027777368:catalogItemsQueue",
      awsRegion: "eu-west-1",
    },
    {
      messageId: "0b0f35b5-39e7-449e-a463-4c120d0b1f4d",
      receiptHandle:
        "AQEBtKk61R7Y3uqTBx6sqJQI+lLi6ZM5RHBzQxzADtrWDnYJkdncN704DZvsJUWInndHXNIA2M5TYJ0bI9qP3hPaF9lKvO4QSBVwoGS8q49QHCYg9NmfnCx6/SZanV+Pu9UZ47/QpY7mX/L4PjTDaVUw6cPV1NLVYxkCmonOJrhIAJOCa9kUwMm/d7jYxcds45vHKYR59wBXIH3H8b6yWhLP1gnHidKK5rLzICDzu468hdKn20nQ3q7ojaL3bUjRdOZZd66jKgoAv3DhkTIBmzqLec9eSGEXVAlXfqJXFyKjhuaIAvSMjMZrpofiRZBEYCHjjQ1WM869zmPzW4WTUvyKG1xZue9syuoFVRBoE/xCi1lP+K2Ie1TeDdDOMieXOycEvuA2rk4Fm5C+SgHa19GnYA==",
      body: '{"title":"Insert New Product","description":"Short Product Description","price":"110","count":"55"}',
      attributes: {},
      messageAttributes: {},
      md5OfMessageAttributes: "a12e644b089defef7683bf24890e7325",
      md5OfBody: "abb91678d0d0949d4f0583b4c81ab761",
      eventSource: "aws:sqs",
      eventSourceARN: "arn:aws:sqs:eu-west-1:546027777368:catalogItemsQueue",
      awsRegion: "eu-west-1",
    },
  ],
};

test("Process batch products", async () => {
  const response = await handler.main(sqsTestEvent); // return in-memory repository with updated and inserted products
  const product = JSON.parse(response.body);
  const { statusCode } = response;

  expect(statusCode).toBe(200);
});
