const { basicRouteAuth } = require("./auth-helper/route-auth.helper"),
  {
    createOneUserAndLogin,
  } = require("../global-helper/createUserAndLogin.helper");

const { dbManagement } = require("../db-management-utils");

dbManagement();

describe("Test logout auth controller", () => {
  it("Test 1) logout with no email", async () => {
    const { responseLogin } = await createOneUserAndLogin({
      route: "auth/login",
    });

    const userCredentialsLogout = {
      email: null,
      refreshToken: responseLogin.body.token.refreshToken.token,
    };

    const responseLogout = await basicRouteAuth({
      userCredentials: userCredentialsLogout,
      route: "auth/logout",
      accessToken: responseLogin.body.token.accessToken,
    });

    expect(responseLogout.body.output.statusCode).toBe(400);
    expect(responseLogout.body.isBoom).toBe(true);
    expect(responseLogout.body.output.payload.message).toMatch(
      "An email or a token is required to logout !"
    );
  });
  it("Test 2) logout with no token", async () => {
    const { adminOne, responseLogin } = await createOneUserAndLogin({
      route: "auth/login",
    });

    const userCredentialsLogout = {
      email: adminOne.email,
      refreshToken: null,
    };

    const responseLogout = await basicRouteAuth({
      userCredentials: userCredentialsLogout,
      route: "auth/logout",
      accessToken: responseLogin.body.token.accessToken,
    });

    expect(responseLogout.body.output.statusCode).toBe(400);
    expect(responseLogout.body.isBoom).toBe(true);
    expect(responseLogout.body.output.payload.message).toMatch(
      "An email or a token is required to logout !"
    );
  });
  it("Test 3) logout", async () => {
    const { adminOne, responseLogin } = await createOneUserAndLogin({
      route: "auth/login",
    });

    const userCredentialsLogout = {
      email: adminOne.email,
      refreshToken: responseLogin.body.token.refreshToken.token,
    };

    const responseLogout = await basicRouteAuth({
      userCredentials: userCredentialsLogout,
      route: "auth/logout",
      accessToken: responseLogin.body.token.accessToken,
    });

    expect(responseLogout.statusCode).toBe(204);
  });
});
