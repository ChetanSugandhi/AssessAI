const passport = require("passport");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;

    if (!req.session.userId) {
      req.session.userId = user.id;
    }
      console.log(req.session.userId)

    next();
  })(req, res, next);
};
