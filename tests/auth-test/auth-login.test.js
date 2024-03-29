const {
    createOneUserAndLogin,
  } = require("../global-helper/createUserAndLogin.helper"),
  { basicRouteAuth } = require("./auth-helper/route-auth.helper"),
  { checkTokenDataAuth } = require("./auth-helper/check-token-auth.helper");

const { dbManagement } = require("../db-management-utils");

dbManagement();

describe("Test login auth controller", () => {
  it("Test 1) send wrong email", async () => {
    let userCredentials = {
      email: "wrongEmail@gmail.com",
      password: "123456789",
    };
    const response = await basicRouteAuth({
      userCredentials,
      route: "auth/login",
    });

    expect(response.body.output.statusCode).toBe(401);
    expect(response.body.isBoom).toBe(true);
    expect(response.body.output.payload.message).toMatch(
      "This email doesn't exist!"
    );
  });
  it("Test 2) login with good user credentials", async () => {
    const { adminOne, responseLogin } = await createOneUserAndLogin({
      route: "auth/login",
    });

    const checkTokenData = await checkTokenDataAuth({
      tokenData: responseLogin.body,
      userId: adminOne._id,
    });

    expect(responseLogin.statusCode).toBe(200);
    expect(checkTokenData.accessToken).toBe(true);
    expect(checkTokenData.type).toBe(true);
    expect(checkTokenData.refreshToken).toBe(true);
    expect(checkTokenData.user).toBe(true);
  });
});
