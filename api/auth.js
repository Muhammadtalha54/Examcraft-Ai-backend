const connectDB = require('../config/db');
const { registerUser, loginUser, verifyEmail } = require('../services/authService');
const { isValidEmail, isValidPassword } = require('../utils/validator');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// Consolidated auth handler for signup, login, and verify
module.exports = async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDB();

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const action = pathname.split('/').pop();

  try {
    switch (action) {
      case 'signup':
        if (req.method !== 'POST') {
          return res.status(405).json(errorResponse('Method not allowed'));
        }
        
        const { email: signupEmail, password: signupPassword } = req.body;
        
        if (!signupEmail || !signupPassword) {
          return res.status(400).json(errorResponse('Email and password are required'));
        }

        if (!isValidEmail(signupEmail)) {
          return res.status(400).json(errorResponse('Please provide a valid email address'));
        }

        if (!isValidPassword(signupPassword)) {
          return res.status(400).json(errorResponse('Password must be at least 8 characters with uppercase, lowercase, and number'));
        }

        await registerUser(signupEmail, signupPassword);
        return res.status(201).json(successResponse('Account created successfully. Check your email to verify.'));

      case 'login':
        if (req.method !== 'POST') {
          return res.status(405).json(errorResponse('Method not allowed'));
        }
        
        const { email: loginEmail, password: loginPassword } = req.body;

        if (!loginEmail || !loginPassword) {
          return res.status(400).json(errorResponse('Email and password are required'));
        }

        if (!isValidEmail(loginEmail)) {
          return res.status(400).json(errorResponse('Please provide a valid email address'));
        }

        const result = await loginUser(loginEmail, loginPassword);
        return res.status(200).json(successResponse('Login successful', result));

      case 'verifyEmail':
        if (req.method !== 'GET') {
          return res.status(405).json(errorResponse('Method not allowed'));
        }
        
        const { token } = req.query;

        if (!token) {
          return res.status(400).json(errorResponse('Verification token is required'));
        }

        await verifyEmail(token);
        return res.status(200).json(successResponse('Email verified successfully. You can now login.'));

      default:
        return res.status(404).json(errorResponse('Auth endpoint not found'));
    }
  } catch (error) {
    const statusCode = action === 'login' ? 401 : 400;
    res.status(statusCode).json(errorResponse(error.message));
  }
};