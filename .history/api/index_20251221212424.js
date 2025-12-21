const express = require('express');
const connectDB = require('../config/db');

// Import services
const { loginUser, signupUser, forgotPassword, resetPassword, verifyEmail } = require('../services/authService');
const { generateMCQ, generateShortAnswer, generateLongAnswer } = require('../services/geminiService');
const { getPrivacyPolicy, getTermsOfService } = require('../services/infoService');
const { submitRating } = require('../services/ratingService');

// Import utilities
const { isValidEmail } = require('../utils/validator');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ExamCraft AI Backend is running!',
    endpoints: [
      'POST /auth/signup',
      'POST /auth/login',
      'POST /auth/forgot-password',
      'POST /auth/reset-password',
      'POST /auth/verify-email',
      'POST /generate/mcq-text',
      'POST /generate/mcq',
      'POST /generate/short',
      'POST /generate/long',
      'GET /info/privacy',
      'GET /info/terms',
      'POST /test/mcq',
      'POST /rate'
    ]
  });
});

// Auth routes
app.post('/auth/signup', async (req, res) => {
  await connectDB();
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json(errorResponse('Email and password are required'));
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json(errorResponse('Please provide a valid email address'));
    }
    
    const result = await signupUser(email, password);
    res.status(201).json(successResponse('User created successfully', result));
  } catch (error) {
    res.status(400).json(errorResponse(error.message));
  }
});

app.post('/auth/login', async (req, res) => {
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
});

app.post('/auth/forgot-password', async (req, res) => {
  await connectDB();
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json(errorResponse('Email is required'));
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json(errorResponse('Please provide a valid email address'));
    }
    
    await forgotPassword(email);
    res.status(200).json(successResponse('Password reset email sent'));
  } catch (error) {
    res.status(400).json(errorResponse(error.message));
  }
});

app.post('/auth/reset-password', async (req, res) => {
  await connectDB();
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json(errorResponse('Token and new password are required'));
    }
    
    await resetPassword(token, newPassword);
    res.status(200).json(successResponse('Password reset successful'));
  } catch (error) {
    res.status(400).json(errorResponse(error.message));
  }
});

app.post('/auth/verify-email', async (req, res) => {
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
});

// Generate routes
app.post('/generate/mcq-text', async (req, res) => {
  try {
    const { content, count = 5, difficulty = 'medium' } = req.body;
    
    if (!content) {
      return res.status(400).json(errorResponse('Content is required'));
    }
    
    const mcqs = await generateMCQ(content, parseInt(count), difficulty);
    res.status(200).json(successResponse('MCQs generated successfully', mcqs));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
});

app.post('/generate/mcq', async (req, res) => {
  try {
    const { content, count = 5, difficulty = 'medium' } = req.body;
    
    if (!content) {
      return res.status(400).json(errorResponse('Content is required'));
    }
    
    const mcqs = await generateMCQ(content, parseInt(count), difficulty);
    res.status(200).json(successResponse('MCQs generated successfully', mcqs));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
});

app.post('/generate/short', async (req, res) => {
  try {
    const { content, count = 5, difficulty = 'medium' } = req.body;
    
    if (!content) {
      return res.status(400).json(errorResponse('Content is required'));
    }
    
    const questions = await generateShortAnswer(content, parseInt(count), difficulty);
    res.status(200).json(successResponse('Short answer questions generated successfully', questions));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
});

app.post('/generate/long', async (req, res) => {
  try {
    const { content, count = 3, difficulty = 'medium' } = req.body;
    
    if (!content) {
      return res.status(400).json(errorResponse('Content is required'));
    }
    
    const questions = await generateLongAnswer(content, parseInt(count), difficulty);
    res.status(200).json(successResponse('Long answer questions generated successfully', questions));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
});

// Info routes
app.get('/info/privacy', async (req, res) => {
  try {
    const policy = await getPrivacyPolicy();
    res.status(200).json(successResponse('Privacy policy retrieved', { policy }));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
});

app.get('/info/terms', async (req, res) => {
  try {
    const terms = await getTermsOfService();
    res.status(200).json(successResponse('Terms of service retrieved', { terms }));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
});

// Test route
app.post('/test/mcq', async (req, res) => {
  try {
    const { questions, answers } = req.body;
    
    if (!questions || !answers) {
      return res.status(400).json(errorResponse('Questions and answers are required'));
    }
    
    // Simple scoring logic
    let score = 0;
    const results = questions.map((q, index) => {
      const isCorrect = answers[index] === q.correctAnswer;
      if (isCorrect) score++;
      return {
        question: q.question,
        userAnswer: answers[index],
        correctAnswer: q.correctAnswer,
        isCorrect
      };
    });
    
    const percentage = Math.round((score / questions.length) * 100);
    
    res.status(200).json(successResponse('Test evaluated successfully', {
      score,
      total: questions.length,
      percentage,
      results
    }));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
});

// Rating route
app.post('/rate', async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    
    if (!rating) {
      return res.status(400).json(errorResponse('Rating is required'));
    }
    
    await submitRating(rating, feedback);
    res.status(200).json(successResponse('Rating submitted successfully'));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json(errorResponse('Endpoint not found'));
});

module.exports = app;