require('dotenv').config();
const { sendVerificationEmail } = require('./services/authService');
const { generateEmailToken } = require('./utils/tokenHandler');

const testSignupEmail = async () => {
  console.log('🧪 Testing signup email flow...\n');
  
  const testEmail = 'talha89@yopmail.com';
  const emailToken = generateEmailToken(testEmail);
  
  console.log('📧 Test email:', testEmail);
  console.log('🔑 Generated token:', emailToken ? '✅ Generated' : '❌ Failed');
  console.log('');

  try {
    console.log('📨 Sending verification email...');
    const result = await sendVerificationEmail(testEmail, emailToken);
    console.log('✅ Email sent successfully!');
    console.log('📬 Message ID:', result.messageId);
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
};

testSignupEmail();