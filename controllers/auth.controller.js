const connectDB = require('../config/db');
const { loginUser, registerUser, verifyEmail } = require('../services/authService');
const { isValidEmail } = require('../utils/validator');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

exports.signup = async (req, res) => {
  await connectDB();
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json(errorResponse('Email and password are required'));
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json(errorResponse('Please provide a valid email address'));
    }
    
    const result = await registerUser(email, password);
    res.status(201).json(successResponse('User created successfully. Please check your email for verification.', result));
  } catch (error) {
    res.status(400).json(errorResponse(error.message));
  }
};

exports.login = async (req, res) => {
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

exports.verifyEmail = async (req, res) => {
  await connectDB();
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json(errorResponse('Verification token is required'));
    }
    
    await verifyEmail(token);
    res.status(200).json(successResponse('Email verified successfully'));
  } catch (error) {
    res.status(400).json(errorResponse(error.message));
  }
};

// Handle email verification from link (GET request)
exports.verifyEmailFromLink = async (req, res) => {
  await connectDB();
  try {
    const { token } = req.query; // GET request uses query params
    
    if (!token) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Verification Failed - ExamCraft AI</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
            h1 { color: #ef4444; margin-bottom: 20px; }
            p { color: #666; line-height: 1.6; }
            .icon { font-size: 64px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">❌</div>
            <h1>Verification Failed</h1>
            <p>No verification token provided. Please use the link from your email.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    await verifyEmail(token);
    
    // Success - show beautiful HTML page
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Verified - ExamCraft AI</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
          h1 { color: #10b981; margin-bottom: 20px; }
          p { color: #666; line-height: 1.6; margin-bottom: 30px; }
          .icon { font-size: 64px; margin-bottom: 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
          .button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">✅</div>
          <h1>Email Verified Successfully!</h1>
          <p>Your email has been verified. You can now log in to ExamCraft AI and start creating amazing exam content!</p>
          <p style="color: #888; font-size: 14px;">You can close this window and return to the app.</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    // Error - show error HTML page
    res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Verification Failed - ExamCraft AI</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
          h1 { color: #ef4444; margin-bottom: 20px; }
          p { color: #666; line-height: 1.6; }
          .icon { font-size: 64px; margin-bottom: 20px; }
          .error { background: #fee; padding: 15px; border-radius: 8px; color: #c00; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">❌</div>
          <h1>Verification Failed</h1>
          <p>We couldn't verify your email address.</p>
          <div class="error">${error.message}</div>
          <p style="margin-top: 20px; font-size: 14px; color: #888;">
            Please try signing up again or contact support if the problem persists.
          </p>
        </div>
      </body>
      </html>
    `);
  }
};

// Forgot password - send reset email
exports.forgotPassword = async (req, res) => {
  await connectDB();
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json(errorResponse('Email is required'));
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json(errorResponse('Please provide a valid email address'));
    }
    
    const { forgotPassword } = require('../services/authService');
    await forgotPassword(email);
    res.status(200).json(successResponse('Password reset email sent. Please check your inbox.'));
  } catch (error) {
    res.status(400).json(errorResponse(error.message));
  }
};

// Show reset password form (GET request from email link)
exports.showResetPasswordForm = async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invalid Link - ExamCraft AI</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
          h1 { color: #ef4444; margin-bottom: 20px; }
          p { color: #666; line-height: 1.6; }
          .icon { font-size: 64px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">❌</div>
          <h1>Invalid Link</h1>
          <p>This password reset link is invalid. Please request a new one.</p>
        </div>
      </body>
      </html>
    `);
  }
  
  // Show password reset form
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reset Password - ExamCraft AI</title>
      <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
        .container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-width: 500px; width: 100%; }
        h1 { color: #667eea; margin-bottom: 10px; text-align: center; }
        p { color: #666; line-height: 1.6; margin-bottom: 30px; text-align: center; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #555; font-weight: 500; }
        input { width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
        input:focus { outline: none; border-color: #667eea; }
        button { width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 10px; }
        button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        .error { background: #fee; color: #c00; padding: 12px; border-radius: 8px; margin-bottom: 20px; display: none; }
        .success { background: #efe; color: #0a0; padding: 12px; border-radius: 8px; margin-bottom: 20px; display: none; }
        .password-strength { height: 4px; background: #e2e8f0; border-radius: 2px; margin-top: 8px; overflow: hidden; }
        .password-strength-bar { height: 100%; width: 0%; transition: all 0.3s; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔐 Reset Your Password</h1>
        <p>Enter your new password below</p>
        
        <div id="error" class="error"></div>
        <div id="success" class="success"></div>
        
        <form id="resetForm">
          <div class="form-group">
            <label>New Password</label>
            <input type="password" id="password" required minlength="6" placeholder="Enter new password">
            <div class="password-strength">
              <div id="strengthBar" class="password-strength-bar"></div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Confirm New Password</label>
            <input type="password" id="confirmPassword" required minlength="6" placeholder="Confirm new password">
          </div>
          
          <button type="submit" id="submitBtn">Reset Password</button>
        </form>
      </div>
      
      <script>
        const token = '${token}';
        const form = document.getElementById('resetForm');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const submitBtn = document.getElementById('submitBtn');
        const errorDiv = document.getElementById('error');
        const successDiv = document.getElementById('success');
        const strengthBar = document.getElementById('strengthBar');
        
        // Password strength indicator
        password.addEventListener('input', () => {
          const val = password.value;
          let strength = 0;
          if (val.length >= 6) strength += 25;
          if (val.length >= 8) strength += 25;
          if (/[A-Z]/.test(val)) strength += 25;
          if (/[0-9]/.test(val)) strength += 25;
          
          strengthBar.style.width = strength + '%';
          strengthBar.style.background = strength < 50 ? '#ef4444' : strength < 75 ? '#f59e0b' : '#10b981';
        });
        
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          errorDiv.style.display = 'none';
          successDiv.style.display = 'none';
          
          if (password.value !== confirmPassword.value) {
            errorDiv.textContent = 'Passwords do not match';
            errorDiv.style.display = 'block';
            return;
          }
          
          if (password.value.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters';
            errorDiv.style.display = 'block';
            return;
          }
          
          submitBtn.disabled = true;
          submitBtn.textContent = 'Resetting...';
          
          try {
            const response = await fetch('/api/auth/reset-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token, newPassword: password.value })
            });
            
            const data = await response.json();
            
            if (data.success) {
              successDiv.textContent = 'Password reset successful! You can now log in with your new password.';
              successDiv.style.display = 'block';
              form.style.display = 'none';
              
              setTimeout(() => {
                window.close();
              }, 3000);
            } else {
              errorDiv.textContent = data.message || 'Failed to reset password';
              errorDiv.style.display = 'block';
              submitBtn.disabled = false;
              submitBtn.textContent = 'Reset Password';
            }
          } catch (error) {
            errorDiv.textContent = 'Network error. Please try again.';
            errorDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Reset Password';
          }
        });
      </script>
    </body>
    </html>
  `);
};

// Reset password (POST request from form)
exports.resetPassword = async (req, res) => {
  await connectDB();
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json(errorResponse('Token and new password are required'));
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json(errorResponse('Password must be at least 6 characters'));
    }
    
    const { resetPassword } = require('../services/authService');
    await resetPassword(token, newPassword);
    res.status(200).json(successResponse('Password reset successful'));
  } catch (error) {
    res.status(400).json(errorResponse(error.message));
  }
};
