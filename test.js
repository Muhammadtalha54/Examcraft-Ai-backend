const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000'; // Change to your Vercel URL after deployment

// Test all endpoints
async function testBackend() {
  console.log('🚀 Testing ExamCraft AI Backend...\n');

  try {
    // 1. Test Signup
    console.log('1️⃣ Testing Signup...');
    const signupData = {
      email: 'test@example.com',
      password: 'TestPass123'
    };
    
    const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, signupData);
    console.log('✅ Signup:', signupResponse.data.message);

    // 2. Test Login (will fail until email verified)
    console.log('\n2️⃣ Testing Login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, signupData);
      console.log('✅ Login:', loginResponse.data.message);
    } catch (error) {
      console.log('⚠️ Login failed (expected - email not verified):', error.response.data.message);
    }

    // 3. Test Privacy Policy
    console.log('\n3️⃣ Testing Privacy Policy...');
    const privacyResponse = await axios.get(`${BASE_URL}/api/info/privacy`);
    console.log('✅ Privacy Policy:', privacyResponse.data.message);

    // 4. Test Terms
    console.log('\n4️⃣ Testing Terms...');
    const termsResponse = await axios.get(`${BASE_URL}/api/info/terms`);
    console.log('✅ Terms:', termsResponse.data.message);

    // 5. Test Rating
    console.log('\n5️⃣ Testing Rating...');
    const ratingData = {
      rating: 5,
      comment: 'Great app!'
    };
    const ratingResponse = await axios.post(`${BASE_URL}/api/rate`, ratingData);
    console.log('✅ Rating:', ratingResponse.data.message);

    // 6. Test File Upload (if you have a test file)
    console.log('\n6️⃣ Testing File Upload...');
    console.log('⚠️ Skipping file upload test - add a test PDF/image to test this');

    console.log('\n🎉 All basic tests passed!');
    console.log('\n📝 Next steps:');
    console.log('1. Check your email for verification link');
    console.log('2. Test file upload with actual PDF/image');
    console.log('3. Deploy to Vercel');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testBackend();