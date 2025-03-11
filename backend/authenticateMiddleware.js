const isLoggedIn = (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ 
                authenticated: false, 
                message: "Unauthorized: You must be logged in!" 
            });
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication Middleware Error:", error);
        return res.status(500).json({ 
            authenticated: false, 
            message: "Internal Server Error" 
        });
    }
};

module.exports = isLoggedIn;