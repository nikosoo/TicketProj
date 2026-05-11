const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        req.user = null; // Allow access to public tickets
        return next(); // Proceed to the next middleware
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        req.user = user; // Attach user information to the request
        next();
    });
};

module.exports = authenticate;
