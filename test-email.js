require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  console.log('🧪 Testing email configuration...\n');
  
  console.log('📧 Email User:', process.env.EMAIL_USER);
  console.log('🔑 Email Pass:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set');
  console.log('🌐 Email Host:', process.env.EMAIL_HOST);
  console.log('🔌 Email Port:', process.env.EMAIL_PORT);
  console.log('');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    console.log('📨 Sending test email...');
    const info = await transporter.sendMail({
      from: `"ExamCraft AI" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email - ExamCraft AI',
      html: '<h2>✅ Email Configuration Working!</h2><p>Your nodemailer setup is working correctly.</p>'
    });

    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('\n✨ Everything is working! Check your inbox.');
  } catch (error) {
    console.error('\n❌ Email test failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Authentication failed! Possible reasons:');
      console.error('1. App password is incorrect or expired');
      console.error('2. 2-Step Verification is not enabled on Gmail');
      console.error('3. App password was revoked');
      console.error('\n📝 To fix:');
      console.error('   1. Go to https://myaccount.google.com/security');
      console.error('   2. Enable 2-Step Verification');
      console.error('   3. Generate new App Password');
      console.error('   4. Update EMAIL_PASS in .env file');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🌐 Connection failed! Check your internet connection.');
    }
  }
};

testEmail();
