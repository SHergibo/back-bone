const { routeRequest } = require("../global-helper/routeRequest.helper"),
  { login } = require("./../global-helper/login.helper"),
  { adminOneDataComplete, adminTwoDataComplete } = require("./../test-data");

const { dbManagement } = require("../db-management-utils");
dbManagement();

describe("Update user", () => {
  it("1) Update user with email of another user", async () => {
    const userOne = await routeRequest({
      route: `users`,
      restType: "post",
      sendedObject: adminOneDataComplete,
    });

    await routeRequest({
      route: `users`,
      restType: "post",
      sendedObject: adminTwoDataComplete,
    });

    const accessToken = await login(
      adminOneDataComplete.email,
      adminOneDataComplete.password
    );

    let updateUserData = {
      username: "David Doe",
      firstname: "David",
      lastname: "Doe",
      email: "pierredoe@test.com",
    };

    const response = await routeRequest({
      route: `users/${userOne.body._id}`,
      restType: "patch",
      sendedObject: updateUserData,
      accessToken: accessToken,
    });

    expect(response.statusCode).toBe(409);
    expect(JSON.parse(response.error.text).isBoom).toBe(true);
    expect(response.body.data.errors.message).toBe('"Email" already exists');
  });
  it("2) Update user", async () => {
    const user = await routeRequest({
      route: `users`,
      restType: "post",
      sendedObject: adminOneDataComplete,
    });

    const accessToken = await login(
      adminOneDataComplete.email,
      adminOneDataComplete.password
    );

    let updateUserData = {
      username: "David Doe",
      firstname: "David",
      lastname: "Doe",
    };

    const response = await routeRequest({
      route: `users/${user.body._id}`,
      restType: "patch",
      sendedObject: updateUserData,
      accessToken: accessToken,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body._id.toString()).toBe(user.body._id.toString());
    expect(response.body.username).toBe(updateUserData.username);
    expect(response.body.firstname).toBe(updateUserData.firstname);
  });
});
