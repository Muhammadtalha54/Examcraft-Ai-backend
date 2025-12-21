const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../config/models');
const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT, BASE_URL } = require('../config/env');
const { generateToken, generateEmailToken, verifyToken } = require('../utils/tokenHandler');

// Create email transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
};

// Register new user with email verification
const registerUser = async (email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({ email, password: hashedPassword });
  await user.save();

  const emailToken = generateEmailToken(email);
  await sendVerificationEmail(email, emailToken);

  return user;
};

// Send verification email to user
const sendVerificationEmail = async (email, token) => {
  const transporter = createTransporter();
  
  // Use production URL for Render, localhost for development
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://examcraft-ai-backend.onrender.com'
    : 'http://localhost:3000';
  
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: '"ExamCraft AI" <' + EMAIL_USER + '>',
    to: email,
    subject: 'Welcome to ExamCraft AI - Verify Your Email',
    html: `
      <h2>Welcome to ExamCraft AI!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${verifyUrl}</p>
      <p>This link expires in 24 hours.</p>
    `
  });
};

// Login user with credentials
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  if (!user.isVerified) {
    throw new Error('Please verify your email before logging in');
  }

  const token = generateToken(user._id);
  return { token, user: { email: user.email } };
};

// Verify email with token
const verifyEmail = async (token) => {
  const decoded = verifyToken(token);
  if (!decoded || !decoded.email) {
    throw new Error('Invalid or expired verification token');
  }

  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    throw new Error('User not found');
  }

  user.isVerified = true;
  await user.save();

  return user;
};

// Forgot password - send reset email
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('No account found with that email address');
  }

  const resetToken = generateEmailToken(email);
  await sendPasswordResetEmail(email, resetToken);
  
  return { message: 'Password reset email sent' };
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const transporter = createTransporter();
  
  // Use production URL for Render, localhost for development
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://examcraft-ai-backend.onrender.com'
    : 'http://localhost:3000';
  
  const resetUrl = `${baseUrl}/api/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: '"ExamCraft AI" <' + EMAIL_USER + '>',
    to: email,
    subject: 'Reset Your Password - ExamCraft AI',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password for ExamCraft AI.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  });
};

// Reset password with token
const resetPassword = async (token, newPassword) => {
  const decoded = verifyToken(token);
  if (!decoded || !decoded.email) {
    throw new Error('Invalid or expired reset token');
  }

  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    throw new Error('User not found');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  await user.save();

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  sendVerificationEmail,
  forgotPassword,
  resetPassword
};