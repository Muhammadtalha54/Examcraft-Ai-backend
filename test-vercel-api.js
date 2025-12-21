const axios = require('axios');

const BASE_URL = 'https://y-nmqq2opmn-talha03366987154-gmailcoms-projects.vercel.app';

// Test functions
async function testAPI() {
  console.log('🚀 Testing ExamCraft AI API on Vercel...\n');

  // Test 1: Root endpoint
  try {
    console.log('1. Testing root endpoint...');
    const response = await axios.get(`${BASE_URL}/api`);
    console.log('✅ Root endpoint working:', response.data);
  } catch (error) {
    console.log('❌ Root endpoint failed:', error.response?.data || error.message);
  }

  // Test 2: Auth signup
  try {
    console.log('\n2. Testing auth signup...');
    const testEmail = `test${Date.now()}@example.com`;
    const response = await axios.post(`${BASE_URL}/api/auth/signup`, {
      email: testEmail,
      password: 'TestPass123'
    });
    console.log('✅ Signup working:', response.data);
  } catch (error) {
    console.log('❌ Signup failed:', error.response?.data || error.message);
  }

  // Test 3: Auth login (should fail with invalid credentials)
  try {
    console.log('\n3. Testing auth login...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    console.log('✅ Login response:', response.data);
  } catch (error) {
    console.log('✅ Login correctly failed (expected):', error.response?.data || error.message);
  }

  // Test 4: MCQ Generation
  try {
    console.log('\n4. Testing MCQ generation...');
    const response = await axios.post(`${BASE_URL}/api/generate/mcq`, {
      content: 'JavaScript is a programming language used for web development.',
      difficulty: 'medium',
      count: 2
    });
    console.log('✅ MCQ generation working:', response.data);
  } catch (error) {
    console.log('❌ MCQ generation failed:', error.response?.data || error.message);
  }

  // Test 5: Short answer generation
  try {
    console.log('\n5. Testing short answer generation...');
    const response = await axios.post(`${BASE_URL}/api/generate/short`, {
      content: 'Node.js is a JavaScript runtime built on Chrome V8 engine.',
      difficulty: 'easy',
      count: 2
    });
    console.log('✅ Short answer generation working:', response.data);
  } catch (error) {
    console.log('❌ Short answer generation failed:', error.response?.data || error.message);
  }

  // Test 6: Privacy policy
  try {
    console.log('\n6. Testing privacy policy...');
    const response = await axios.get(`${BASE_URL}/api/info/privacy`);
    console.log('✅ Privacy policy working:', response.data.message.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ Privacy policy failed:', error.response?.data || error.message);
  }

  console.log('\n🎉 API testing completed!');
}

// Run tests
testAPI().catch(console.error);