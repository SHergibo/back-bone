const { createUser } = require("./createUserManagement.helper"),
  { basicRouteAuth } = require("../auth-test/auth-helper/route-auth.helper"),
  { adminOneDataComplete } = require("../test-data");

const createOneAdmin = async ({ userData }) => {
  let admin = await createUser({ userData: userData });

  user = {
    _id: admin._id,
    email: admin.email,
    clearPasswordForTesting: userData.password,
  };

  return { user };
};

module.exports.createOneUserAndLogin = async ({ route }) => {
  const { user } = await createOneAdmin({
    userData: adminOneDataComplete,
  });

  let userCredentialsLogin = {
    email: user.email,
    password: user.clearPasswordForTesting,
  };

  const responseLogin = await basicRouteAuth({
    userCredentials: userCredentialsLogin,
    route,
  });

  return { adminOne: user, responseLogin };
};
