// authenticateMiddleware.js
module.exports = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    
    // For API requests, return JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(401).json({ message: "Please login first", redirectTo: "/login" });
    }
    
    // For regular requests, redirect
    req.flash("error", "You must be logged in");
    res.redirect("/login");
};