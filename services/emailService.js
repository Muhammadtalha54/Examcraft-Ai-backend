const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS } = require('../config/env');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const transporter = createTransporter();
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://examcraft-ai-backend.onrender.com'
    : 'http://localhost:3000';
  
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

  return await transporter.sendMail({
    from: `"ExamCraft AI" <${EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to ExamCraft AI - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Welcome to ExamCraft AI! 🎓</h2>
        <p>Thank you for joining ExamCraft AI. Please verify your email address to get started.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
        <p style="color: #888; font-size: 14px;">This link expires in 24 hours.</p>
      </div>
    `
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const transporter = createTransporter();
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://examcraft-ai-backend.onrender.com'
    : 'http://localhost:3000';
  
  const resetUrl = `${baseUrl}/api/auth/reset-password?token=${token}`;

  return await transporter.sendMail({
    from: `"ExamCraft AI" <${EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password - ExamCraft AI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Password Reset Request 🔐</h2>
        <p>You requested to reset your password for ExamCraft AI.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
        </div>
        <p>Or copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p style="color: #888; font-size: 14px;">This link expires in 24 hours.</p>
        <p style="color: #888; font-size: 14px;">If you didn't request this, please ignore this email.</p>
      </div>
    `
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};