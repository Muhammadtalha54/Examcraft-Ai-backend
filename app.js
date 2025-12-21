const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`\n🔥 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('📦 Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// CORS middleware
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware to check body parsing
app.use((req, res, next) => {
  console.log('🔍 After body parsing - Body:', JSON.stringify(req.body, null, 2));
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ExamCraft AI Backend is running!',
    endpoints: [
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'POST /api/auth/forgot-password',
      'POST /api/auth/reset-password',
      'POST /api/auth/verify-email',
      'POST /api/generate/mcq-text',
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

// Mount API routes
app.use('/api', routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

module.exports = app;
