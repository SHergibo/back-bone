const TokenAuth = require('../models/token-auth.model'),
  Boom = require('@hapi/boom'),
  User = require('./../models/user.model'),
  Moment = require('moment-timezone')

/** 
* POST new email verification token  
*/
exports.createNewToken = async (req, res, next) => {
  try {
    let expiredToken = await TokenAuth.findOne({ token: req.params.tokenId });
    let user = await User.findById(expiredToken.userId);
    await TokenAuth.findByIdAndDelete(expiredToken.id);
    TokenAuth.generate(user);
    return res.status(204).send();
  } catch (error) {
    next({error: error, boom: Boom.badImplementation(error.message)});
  }
}

/** 
* PATCH email verification token 
*/
exports.updateUsedToken = async (req, res, next) => {
  try {
    let findTokenAuth = await TokenAuth.findOne({ token: req.params.tokenId });
    if (findTokenAuth.expires < Moment().toDate()) {
      return next(Boom.unauthorized('Verification token expired'));
    } else {
      let token = await TokenAuth.findOneAndUpdate({ token: req.params.tokenId }, { used: true });
      let user = await User.findByIdAndUpdate(token.userId, { role: "user" });
      return res.json(user.transform());
    }
  } catch (error) {
    next({error: error, boom: Boom.badImplementation(error.message)});
  }
}