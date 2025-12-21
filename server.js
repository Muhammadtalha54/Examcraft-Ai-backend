require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Logging middleware
app.use((req, res, next) => {
  console.log(`\n🔥 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('📦 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('📝 Body:', JSON.stringify(req.body, null, 2));
  next();
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware to check body parsing
app.use((req, res, next) => {
  console.log('🔍 After body parsing - Body:', JSON.stringify(req.body, null, 2));
  next();
});

// Import API routes
const authSignup = require('./api/auth/signup');
const authLogin = require('./api/auth/login');
const authForgot = require('./api/auth/forgotPassword');
const authVerify = require('./api/auth/verifyEmail');
const authReset = require('./api/auth/resetPassword');
const generateMCQ = require('./api/generate/mcq');
const generateShort = require('./api/generate/short');
const generateLong = require('./api/generate/long');
const testMCQ = require('./api/test/mcq');
const infoPrivacy = require('./api/info/privacy');
const infoTerms = require('./api/info/terms');
const rate = require('./api/rate');

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ExamCraft AI Backend is running!',
    endpoints: [
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'POST /api/auth/forgot-password',
      'POST /api/auth/verify-email',
      'GET/POST /api/auth/reset-password',
      'POST /api/generate/mcq',
      'POST /api/generate/short',
      'POST /api/generate/long',
      'POST /api/test/mcq',
      'GET /api/info/privacy',
      'GET /api/info/terms',
      'POST /api/rate'
    ]
  });
});

// API routes
app.post('/api/auth/signup', authSignup);
app.post('/api/auth/login', authLogin);
app.post('/api/auth/forgot-password', authForgot);
app.post('/api/auth/verify-email', authVerify);
app.get('/api/auth/reset-password', authReset);
app.post('/api/auth/reset-password', authReset);
app.post('/api/generate/mcq', generateMCQ);
app.post('/api/generate/short', generateShort);
app.post('/api/generate/long', generateLong);
app.post('/api/test/mcq', testMCQ);
app.get('/api/info/privacy', infoPrivacy);
app.get('/api/info/terms', infoTerms);
app.post('/api/rate', rate);

app.listen(PORT, () => {
  console.log(`🚀 ExamCraft AI Backend running on http://localhost:${PORT}`);
  console.log('📊 Environment:', process.env.NODE_ENV || 'development');
  console.log('🔗 MongoDB URI configured:', !!process.env.MONGO_URI);
});