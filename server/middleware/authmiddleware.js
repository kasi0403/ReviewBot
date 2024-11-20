const jwt = require('jsonwebtoken');
const { RegisterModel } = require('../schemas/allSchemas'); // Adjust path as needed

const protect = async (req, res, next) => {
    let token;

    // Check if the token is provided in the request headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get the token from the Authorization header
            token = req.headers.authorization.split(' ')[1];
            console.log('Token received:', token); // Log the received token

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded); // Log the decoded token

            // Attach the user ID to the request object
            req.user = await RegisterModel.findById(decoded.id).select('-password'); // Exclude password from user object

            next(); // Call the next middleware or route handler
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is provided
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
