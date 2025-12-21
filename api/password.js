const connectDB = require('../config/db');
const User = require('../config/models');
const { generateResetToken, verifyToken } = require('../utils/tokenHandler');
const { isValidEmail, isValidPassword } = require('../utils/validator');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS, BASE_URL } = require('../config/env');

// Consolidated password reset handler
module.exports = async (req, res) => {
  await connectDB();

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const action = pathname.split('/').pop();

  try {
    switch (action) {
      case 'forgotPassword':
        if (req.method !== 'POST') {
          return res.status(405).json(errorResponse('Method not allowed'));
        }

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

        const resetUrl = `${BASE_URL}/api/password/resetPassword?token=${resetToken}`;

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

        return res.status(200).json(successResponse('Password reset email sent successfully'));

      case 'resetPassword':
        if (req.method === 'GET') {
          // Show reset password form
          const { token } = req.query;
          
          if (!token) {
            return res.status(400).send(`
              <html>
                <body style="font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px;">
                  <h2 style="color: #e74c3c;">Invalid Reset Link</h2>
                  <p>The reset link is invalid or missing.</p>
                </body>
              </html>
            `);
          }

          // Verify token
          const decoded = verifyToken(token);
          if (!decoded || decoded.type !== 'reset') {
            return res.status(400).send(`
              <html>
                <body style="font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px;">
                  <h2 style="color: #e74c3c;">Expired Reset Link</h2>
                  <p>This reset link has expired or is invalid. Please request a new password reset.</p>
                </body>
              </html>
            `);
          }

          // Show password reset form
          return res.status(200).send(`
            <html>
              <head>
                <title>Reset Password - ExamCraft AI</title>
                <style>
                  body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }
                  .form-group { margin-bottom: 20px; }
                  label { display: block; margin-bottom: 5px; font-weight: bold; }
                  input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
                  button { background: #3498db; color: white; padding: 12px 20px; border: none; border-radius: 5px; cursor: pointer; width: 100%; }
                  button:hover { background: #2980b9; }
                  .error { color: #e74c3c; margin-top: 10px; }
                  .success { color: #27ae60; margin-top: 10px; }
                </style>
              </head>
              <body>
                <h2>Reset Your Password</h2>
                <p>Enter your new password below:</p>
                
                <form id="resetForm">
                  <div class="form-group">
                    <label for="password">New Password:</label>
                    <input type="password" id="password" name="password" required 
                           placeholder="At least 8 characters with uppercase, lowercase, and number">
                  </div>
                  
                  <div class="form-group">
                    <label for="confirmPassword">Confirm Password:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required 
                           placeholder="Re-enter your new password">
                  </div>
                  
                  <button type="submit">Reset Password</button>
                </form>
                
                <div id="message"></div>

                <script>
                  document.getElementById('resetForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const password = document.getElementById('password').value;
                    const confirmPassword = document.getElementById('confirmPassword').value;
                    const messageDiv = document.getElementById('message');
                    
                    if (password !== confirmPassword) {
                      messageDiv.innerHTML = '<div class="error">Passwords do not match!</div>';
                      return;
                    }
                    
                    try {
                      const response = await fetch('/api/password/resetPassword', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          token: '${token}', 
                          newPassword: password 
                        })
                      });
                      
                      const result = await response.json();
                      
                      if (result.success) {
                        messageDiv.innerHTML = '<div class="success">Password reset successfully! You can now login with your new password.</div>';
                        document.getElementById('resetForm').style.display = 'none';
                      } else {
                        messageDiv.innerHTML = '<div class="error">' + result.message + '</div>';
                      }
                    } catch (error) {
                      messageDiv.innerHTML = '<div class="error">An error occurred. Please try again.</div>';
                    }
                  });
                </script>
              </body>
            </html>
          `);
        }

        if (req.method === 'POST') {
          // Process password reset
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

          return res.status(200).json(successResponse('Password reset successfully'));
        }

        return res.status(405).json(errorResponse('Method not allowed'));

      default:
        return res.status(404).json(errorResponse('Password endpoint not found'));
    }
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};