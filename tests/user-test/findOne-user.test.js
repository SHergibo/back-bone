const { routeRequest } = require("../global-helper/routeRequest.helper"),
  { login } = require("./../global-helper/login.helper"),
  { adminOneDataComplete } = require("./../test-data");

const { dbManagement } = require("../db-management-utils");
dbManagement();

describe("Get user", () => {
  it("1) Get user", async () => {
    const user = await routeRequest({
      route: `users`,
      restType: "post",
      sendedObject: adminOneDataComplete,
    });

    const accessToken = await login(
      adminOneDataComplete.email,
      adminOneDataComplete.password
    );

    const response = await routeRequest({
      route: `users/${user.body._id}`,
      restType: "get",
      accessToken: accessToken,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body._id.toString()).toBe(user.body._id.toString());
  });
});
