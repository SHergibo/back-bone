const Mongoose = require("mongoose"),
  DomPurify = require("isomorphic-dompurify"),
  Moment = require("moment-timezone"),
  Jwt = require("jwt-simple"),
  Bcrypt = require("bcrypt"),
  Boom = require("@hapi/boom");

const {
  env,
  jwtSecret,
  jwtExpirationInterval,
} = require("../../config/environment.config");

const roles = ["admin", "user", "ghost"];

let Schema = Mongoose.Schema;

let schema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    set: function (val) {
      return DomPurify.sanitize(val);
    },
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
    set: function (val) {
      return DomPurify.sanitize(val);
    },
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    set: function (val) {
      return DomPurify.sanitize(val);
    },
  },
  email: {
    type: String,
    required: "You must specify an email",
    trim: true,
    lowercase: true,
    unique: true,
    match: [
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  role: {
    type: String,
    enum: roles,
    required: true,
  },
});

schema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    let salt = env === "staging" ? 1 : 10;
    let hash = await Bcrypt.hash(this.password, salt);
    this.password = hash;
    return next();
  } catch (error) {
    next({ error: error, boom: Boom.badImplementation(error.message) });
  }
});

schema.methods.token = function () {
  const payload = {
    iat: Moment().unix(),
    exp: Moment().add(jwtExpirationInterval, "minutes").unix(),
    sub: this._id,
  };
  return Jwt.encode(payload, jwtSecret);
};

schema.methods.passwordMatches = async function (pwd) {
  return await Bcrypt.compare(pwd, this.password);
};

schema.methods.transform = function () {
  const fields = ["_id", "username", "firstname", "lastname", "email", "role"];
  const object = {};
  fields.forEach((field) => {
    object[field] = this[field];
  });
  return object;
};

schema.statics.roles = roles;

schema.statics.get = async function (id) {
  try {
    let user;
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw Boom.badRequest("ID is not valid");
    }

    user = await this.findById(id);

    if (!user) {
      throw Boom.notFound("User not found");
    }
    return user;
  } catch (error) {
    throw Boom.badImplementation(err.message);
  }
};

schema.statics.findAndGenerateToken = async function (options) {
  const { email, password, refreshObject } = options;

  if (!email) throw Boom.badRequest("An email is required to generate a token");
  if (!refreshObject) {
    if (!password)
      throw Boom.badRequest(
        "A password is required to authorize a token generation"
      );
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Boom.notFound("User not found");
  }

  if (!refreshObject) {
    if ((await user.passwordMatches(password)) === false) {
      throw Boom.unauthorized(
        "Password must match to authorize a token generation"
      );
    }
  }

  if (
    refreshObject &&
    refreshObject.userEmail === email &&
    Moment(refreshObject.expires).isBefore()
  ) {
    throw Boom.unauthorized("Invalid refresh token");
  }

  return { user, accessToken: user.token() };
};

schema.statics.checkDuplicateEmail = function (error) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    return Boom.conflict("Validation error", {
      errors: {
        field: "email",
        location: "body",
        message: '"Email" already exists',
      },
    });
  }
  return error;
};

module.exports = Mongoose.model("User", schema);
