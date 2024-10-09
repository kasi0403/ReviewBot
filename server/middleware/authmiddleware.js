const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const {RegisterModel} = require('../schemas/allSchemas');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    //   console.log("Token received:", token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   console.log("Decoded token:", decoded);

      // Get user from the token
      req.user = await RegisterModel.findById(decoded.id).select('-password');
    //   console.log("User found:", req.user);

      if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error.message);
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

module.exports = { protect };
