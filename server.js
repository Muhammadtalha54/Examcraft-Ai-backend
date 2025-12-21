require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 ExamCraft AI Backend running on http://localhost:${PORT}`);
  console.log('📊 Environment:', process.env.NODE_ENV || 'development');
  console.log('🔗 MongoDB URI configured:', !!process.env.MONGO_URI);
});