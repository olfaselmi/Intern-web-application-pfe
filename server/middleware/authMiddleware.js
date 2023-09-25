const jwt = require('jsonwebtoken');



//@author Olfa Selmi
//@desc middleware responsible for token verification ( Private methods ) (Authorization)
const authMiddleware = (req, res, next) => {
    // Get token from header ( when we send a request to a prootected route we need this middleware)
    const token = req.header("x-auth-token");

    // Check the existence of the token
    if (!token) {
        return res.status(401).json({ message: "No token found!" });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, "this a secret key");
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(401).json({ message: "Token is invalid" });
    }
};

module.exports = authMiddleware;