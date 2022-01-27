const User = require("../../api/models/user.model");

module.exports.createUser = async ({ userData }) => {
  let createdUser = await new User({
    username: userData.username,
    firstname: userData.firstname,
    lastname: userData.lastname,
    email: userData.email,
    password: userData.password,
    role: userData.role,
  });
  await createdUser.save();

  return createdUser;
};
