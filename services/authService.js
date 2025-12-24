const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../config/models');
const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT, BASE_URL } = require('../config/env');
const { generateToken, generateEmailToken, verifyToken } = require('../utils/tokenHandler');

// Create email transporter for sending emails
const createTransporter = () => {
  const config = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  };
  
  console.log('📧 Email config:', { user: EMAIL_USER, hasPassword: !!EMAIL_PASS });
  return nodemailer.createTransport(config);
};

// Register new user with email verification
const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  // Send verification email in background (non-blocking)
  const emailToken = generateEmailToken(email);
  console.log('🚀 Attempting to send verification email to:', email);
  sendVerificationEmail(email, emailToken)
    .then(() => {
      console.log('✅ Verification email sent successfully to:', email);
    })
    .catch(err => {
      console.error('❌ Failed to send verification email to:', email);
      console.error('Error details:', err.message);
      console.error('Full error:', err);
    });

  return user;
};

// Send verification email to user
const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ Email server connection verified');
    
    // Use production URL for Render, localhost for development
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://examcraft-ai-backend.onrender.com'
      : 'http://localhost:3000';
    
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

    try {
      const info = await transporter.sendMail({
        from: `"ExamCraft AI" <${process.env.EMAIL_USER}>`,
        to: email, // talha89@yopmail.com
        subject: "Verify your account",
        html: "<h2>Test Email</h2>",
      });

      console.log("✅ MAIL SENT:", info.response);
      return info;
    } catch (error) {
      console.log("❌ MAIL SEND FAILED:");
      console.log(error);          // FULL error
      console.log(error.message);  // readable error
      throw error;
    }
    return info;
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
    throw error;
  }
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
  return { token, user: { name: user.name, email: user.email } };
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
    // Don't reveal if user exists or not (security best practice)
    return { message: 'If an account exists, reset email sent' };
  }

  const resetToken = generateEmailToken(email);
  
  // Send email in background (non-blocking)
  console.log('🚀 Attempting to send password reset email to:', email);
  sendPasswordResetEmail(email, resetToken)
    .then(() => {
      console.log('✅ Password reset email sent successfully to:', email);
    })
    .catch(err => {
      console.error('❌ Failed to send password reset email to:', email);
      console.error('Error details:', err.message);
      console.error('Full error:', err);
    });
  
  return { message: 'Password reset email sent' };
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    
    // Use production URL for Render, localhost for development
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://examcraft-ai-backend.onrender.com'
      : 'http://localhost:3000';
    
    const resetUrl = `${baseUrl}/api/auth/reset-password?token=${token}`;

    const info = await transporter.sendMail({
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
    
    console.log('✅ Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
    throw error;
  }
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