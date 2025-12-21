const connectDB = require('../../config/db');
const { loginUser } = require('../../services/authService');
const { isValidEmail } = require('../../utils/validator');
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

    const result = await loginUser(email, password);
    res.status(200).json(successResponse('Login successful', result));
  } catch (error) {
    res.status(401).json(errorResponse(error.message));
  }
};