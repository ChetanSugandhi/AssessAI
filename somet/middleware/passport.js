import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      let user;
      if (jwt_payload.role === "teacher") {
        user = await Teacher.findById(jwt_payload.id);
      } else if (jwt_payload.role === "student") {
        user = await Student.findById(jwt_payload.id);
      }
      if (user) {
        user.role = jwt_payload.role;
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }),
);

export default passport;
