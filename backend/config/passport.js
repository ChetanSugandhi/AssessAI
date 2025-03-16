const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const Teacher = require("../Models/teacher");
const Student = require("../Models/student");
const jwtConfig = require("./jwt");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secret,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      // Try finding a teacher first
      const teacher = await Teacher.findById(jwtPayload.id);
      if (teacher) {
        return done(null, teacher);
      }

      // If no teacher, try finding a student
      const student = await Student.findById(jwtPayload.id);
      if (student) {
        return done(null, student);
      }

      // No user found in either collection
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
