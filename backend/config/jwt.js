module.exports = {
  secret: process.env.JWT_SECRET || "asdfghjklpoi",
  expiresIn: "1h",
};
