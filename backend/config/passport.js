const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const Teacher = require("../Models/teacher");
const jwtConfig = require("./jwt");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secret,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const teacher = await Teacher.findById(jwtPayload.id);
      if (teacher) return done(null, teacher);
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
