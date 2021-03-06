const User = require('./../models/user.model'),
      Boom = require('@hapi/boom');

/**
* Post one user
*/
exports.add = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.json(user.transform());
  } catch (error) {
    next({ error: error, boom: User.checkDuplicateEmail(error) });
  }
};

/**
* GET one user
*/
exports.findOne = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    return res.json(user.transform());
  } catch (error) {
    next({ error: error, boom: Boom.badImplementation(error.message) });
  }
};

/**
* PATCH user
*/
exports.update = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body);
    return res.json(user.transform());
  } catch (error) {
    next({ error: error, boom: User.checkDuplicateEmail(error) });
  }
};

/**
* DELETE user
*/
exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    return res.json(user.transform());
  } catch (error) {
    next({ error: error, boom: Boom.badImplementation(error.message) });
  }
};