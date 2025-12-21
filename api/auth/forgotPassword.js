const connectDB = require('../../config/db');
const User = require('../../config/models');
const { generateResetToken } = require('../../utils/tokenHandler');
const { isValidEmail } = require('../../utils/validator');
const { successResponse, errorResponse } = require('../../utils/responseFormatter');
const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS, BASE_URL } = require('../../config/env');

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
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json(errorResponse('Please provide a valid email address'));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(errorResponse('No account found with this email'));
    }

    const resetToken = generateResetToken(email);
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });

    const resetUrl = `${BASE_URL}/api/auth/resetPassword?token=${resetToken}`;

    await transporter.sendMail({
      from: '"ExamCraft AI" <' + EMAIL_USER + '>',
      to: email,
      subject: 'ExamCraft AI - Password Reset',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `
    });

    res.status(200).json(successResponse('Password reset email sent successfully'));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};