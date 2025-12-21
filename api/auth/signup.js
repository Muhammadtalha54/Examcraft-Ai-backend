const connectDB = require('../../config/db');
const { registerUser } = require('../../services/authService');
const { isValidEmail, isValidPassword } = require('../../utils/validator');
const { successResponse, errorResponse } = require('../../utils/responseFormatter');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  await connectDB();

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json(errorResponse('Email and password are required'));
    }

    if (!isValidEmail(email)) {
      return res.status(400).json(errorResponse('Please provide a valid email address'));
    }

    if (!isValidPassword(password)) {
      return res.status(400).json(errorResponse('Password must be at least 8 characters with uppercase, lowercase, and number'));
    }

    await registerUser(email, password);
    res.status(201).json(successResponse('Account created successfully. Check your email to verify.'));
  } catch (error) {
    res.status(400).json(errorResponse(error.message));
  }
};