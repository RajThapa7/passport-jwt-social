var passport = require("passport");
var passportJWT = require("passport-jwt");
const User = require("../userModel.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

var params = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = function () {
  var strategy = new Strategy(params, async function (payload, done) {
    try {
      if (payload.expire <= Date.now()) {
        return done(new Error("TokenExpired"), null);
      }
      const user = await User.findById(payload.id);
      return done(null, user);
    } catch (error) {
      return done(new Error("UserNotFound"), null);
    }
  });

  passport.use(strategy);

  return {
    initialize: function () {
      return passport.initialize();
    },
  };
};
