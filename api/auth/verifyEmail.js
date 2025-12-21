const connectDB = require('../../config/db');
const { verifyEmail } = require('../../services/authService');
const { successResponse, errorResponse } = require('../../utils/responseFormatter');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  await connectDB();

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json(errorResponse('Verification token is required'));
    }

    await verifyEmail(token);
    res.status(200).json(successResponse('Email verified successfully. You can now login.'));
  } catch (error) {
    res.status(400).json(errorResponse(error.message));
  }
};