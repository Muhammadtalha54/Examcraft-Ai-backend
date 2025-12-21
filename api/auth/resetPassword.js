const connectDB = require('../../config/db');
const User = require('../../config/models');
const { verifyToken } = require('../../utils/tokenHandler');
const { isValidPassword } = require('../../utils/validator');
const { successResponse, errorResponse } = require('../../utils/responseFormatter');
const bcrypt = require('bcryptjs');

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
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json(errorResponse('Token and new password are required'));
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json(errorResponse('Password must be at least 8 characters with uppercase, lowercase, and number'));
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.type !== 'reset') {
      return res.status(400).json(errorResponse('Invalid or expired reset token'));
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json(successResponse('Password reset successfully'));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};