const { routeRequest } = require("../global-helper/routeRequest.helper"),
  { adminOneDataComplete } = require("./../test-data");

const { dbManagement } = require("../db-management-utils");

dbManagement();

describe("Create user", () => {
  it("1) Create two users with same email", async () => {
    await routeRequest({
      route: `users`,
      restType: "post",
      sendedObject: adminOneDataComplete,
    });

    const responseTwo = await routeRequest({
      route: `users`,
      restType: "post",
      sendedObject: adminOneDataComplete,
    });

    expect(responseTwo.statusCode).toBe(409);
    expect(JSON.parse(responseTwo.error.text).isBoom).toBe(true);
    expect(responseTwo.body.data.errors.message).toBe('"Email" already exists');
  });
  it("2) Add user", async () => {
    const response = await routeRequest({
      route: `users`,
      restType: "post",
      sendedObject: adminOneDataComplete,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.role).toBe("admin");
  });
});
