const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES } = require('../config/env');

// Generate JWT token for user
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Generate email verification token
const generateEmailToken = (email) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
};

// Generate password reset token
const generateResetToken = (email) => {
  return jwt.sign({ email, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
  generateToken,
  verifyToken,
  generateEmailToken,
  generateResetToken
};