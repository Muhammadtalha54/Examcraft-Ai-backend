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
  const verifyUrl = `${BASE_URL}/api/auth/verifyEmail?token=${token}`;

  await transporter.sendMail({
    from: '"ExamCraft AI" <' + EMAIL_USER + '>',
    to: email,
    subject: 'Welcome to ExamCraft AI - Verify Your Email',
    html: `
      <h2>Welcome to ExamCraft AI!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}">Verify Email</a>
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

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  sendVerificationEmail
};