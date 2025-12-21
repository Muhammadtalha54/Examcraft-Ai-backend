module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  res.status(200).json({
    success: true,
    message: 'ExamCraft AI Backend is running!',
    endpoints: [
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'POST /api/generate/mcq',
      'GET /api/info/privacy'
    ]
  });
};