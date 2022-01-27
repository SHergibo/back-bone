const { routeRequest } = require("../global-helper/routeRequest.helper"),
  { login } = require("./../global-helper/login.helper"),
  User = require("./../../api/models/user.model"),
  { adminOneDataComplete } = require("./../test-data");

const { dbManagement } = require("../db-management-utils");
dbManagement();

describe("Remove user", () => {
  it("1) Remove user", async () => {
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
      restType: "delete",
      accessToken: accessToken,
    });

    const findDeletedUser = await User.findById(user.body._id);

    expect(response.statusCode).toBe(200);
    expect(findDeletedUser).toBeNull();
  });
});
