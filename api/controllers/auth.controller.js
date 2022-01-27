const HttpStatus = require("http-status"),
  User = require("./../models/user.model"),
  RefreshToken = require("./../models/refresh-token.model"),
  Moment = require("moment-timezone");

const { jwtExpirationInterval } = require("./../../config/environment.config");

/**
 * Build a token response and return it
 *
 * @param {Object} user
 * @param {String} accessToken
 *
 * @returns A formated object with tokens
 *
 * @private
 */

const _generateTokenResponse = function (user, accessToken) {
  const tokenType = "Bearer";
  const refreshToken = RefreshToken.generate(user);
  const expiresIn = Moment().add(jwtExpirationInterval, "minutes");
  return { tokenType, accessToken, refreshToken, expiresIn };
};

/**
 * Connect user if valid username and password is provided
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @return JWT|next
 *
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const checkUser = await User.findOne({ email: req.body.email });

    if (!checkUser) return next(Boom.unauthorized("This email doesn't exist!"));

    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = _generateTokenResponse(user, accessToken);
    return res.json({ token, user: user.transform() });
  } catch (error) {
    next({ error: error, boom: Boom.badImplementation(error.message) });
  }
};

/**
 * Refresh JWT token by RefreshToken removing, and re-creating
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @return JWT|next
 *
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;

    const checkUser = await User.findOne({ email });
    if (!checkUser) return next(Boom.unauthorized("This email doesn't exist!"));

    const refreshObject = await RefreshToken.findOneAndDelete({
      userEmail: email,
      token: refreshToken,
    });

    const { user, accessToken } = await User.findAndGenerateToken({
      email,
      refreshObject,
    });
    const response = _generateTokenResponse(user, accessToken);

    return res.json(response);
  } catch (error) {
    next({ error: error, boom: Boom.badImplementation(error.message) });
  }
};

/**
 * logout user and delete token
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @return JWT|next
 *
 * @public
 */
exports.logout = async (req, res, next) => {
  try {
    const { email, token } = req.body;
    if (!email || !token)
      return next(
        Boom.badRequest("An email or a token is required to logout !")
      );
    await RefreshToken.findOneAndDelete({
      token: token,
      userEmail: email,
    });
    return res.status(204).send();
  } catch (error) {
    next({ error: error, boom: Boom.badImplementation(error.message) });
  }
};
