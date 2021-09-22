// const AWSMock = require("aws-sdk-mock");
// const AWS = require("aws-sdk");

const AWS = require("aws-sdk-mock");

const importProductsFileHandler = require("../src/functions/importProductsFile/handler");

const testEvent = {
  queryStringParameters: {
    name: "productsdump.csv",
  },
};

describe("the module", () => {
  /**
      TESTS below here
  **/

  it("Get signed URL", async () => {
    // Overwriting s3 getSignedUrl
    const mockedSignedUrl =
      "https://shop-products-source.s3.eu-west-1.amazonaws.com/uploaded/productsdump.csv?AWSAccessKeyId=ASIAX6IOKVVMALXEBEZA&Content-Type=text%2Fcsv&Expires=1632309087&Signature=9nu6pUPoRWITrDMl8v3ZGdpOy3w%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJGMEQCIDzMcv2%2BxooRumrBazVzsGZGEz5rRqrbnVspL8j8DznzAiAajURdnsXhAzsM2zDacglT18q0X5XM6H5GKh8MP8UkkiqtAggTEAAaDDU0NjAyNzc3NzM2OCIM9YAERZ6f6UCr71qTKooC8suGrByuhvWBkCk9aaBf%2FYZo9htRK7A9jRjp8XOF1SfNH%2BbSAKgEQ%2BX%2FIKYjn2q%2BiTbWWeOYdalEEkeObM8GJWaIuW5qE%2FIcJurcC5FjCewPZrCwiXSts3f%2FOOqX%2Fp15akKDJIz%2FLoTBiXa66c7vOS1tb72l3I%2B9TVT1Zd5JsAJAElzSIXNJMPfHyY8fhVnEnk9XAjyDn6AjaYLoM1ChKQRLrIschjQ5PZJkNny79wpnhFrB7kld9LpD39NREitV5pLhAUBpif%2FNZEBplhE5fMaiVHbINTmld%2BWLkgtZDNUGymcVOmnodoRPxj8J0FU94Ykdf5cHJ7vIamN9YEfPV4B2F28CZj66CM8w7P%2BrigY6mwEYPdNLLaIVXg0yPf8Wd9WDbM1XZbNQQM6ev5B6q8%2B262F313HrmWYeDVWLZn0z832zYM9HUrx4s57HTuQ5SwxhUt8ystt86puHFO9qqNs2MvTSmnR%2FXUId3cspBqJBp2O5vY6KTlHyhC4PKp7XNPYCTqX6TpYt8iwH5rlspVAA4RKw0hHBSYhy2FgZ1QxmtPFrEjBcpNk5uobcxg%3D%3D";

    AWS.mock("S3", "getSignedUrl", function ({ Bucket, Key }, callback) {
      console.log("mock called on bucket", Bucket);
      return { url: mockedSignedUrl };
    });

    // AWSMock.setSDKInstance(AWS);
    // // AWSMock.mock("S3", "getSignedUrl", function (params, callback) {
    // //   callback(null, mockedSignedUrl);
    // // });

    // AWSMock.mock("S3", "getSignedUrl", ({ Bucket, Key }, callback) => {
    //   callback(null, { url: mockedSignedUrl });
    // });

    const response = await importProductsFileHandler.main(testEvent);
    const signedUrl = JSON.parse(response.body.url);
    const { statusCode } = response;

    expect(signedUrl).toBe(mockedSignedUrl);

    expect(statusCode).toBe(200);
  });

  // it("Import file to S3", async () => {
  //   // Overwriting s3 putObject command

  //   AWSMock.mock("S3", "getObject", ({ Bucket, Key }, callback) => {
  //     if (Bucket === "test-bucket" && Key === "file.txt") {
  //      callback(null, { Body: new Buffer("Test file!\n") });
  //     }
  //     if (Bucket === "test-bucket" && Key === "empty.txt") {
  //      callback(null, { Body: new Buffer("") });
  //     }
  //     callback(new Error("File not found"));
  //    });

  // });
});
