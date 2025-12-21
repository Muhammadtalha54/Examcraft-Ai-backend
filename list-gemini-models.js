// List Available Gemini Models
// Run this to see which models are available for your API key

require('dotenv').config();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log('\n🔍 Gemini API Model Checker\n');
console.log('================================\n');

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in .env file!');
  process.exit(1);
}

console.log('✅ API Key found');
console.log('🔄 Fetching available models...\n');

// List models using v1 API
const listModels = async () => {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`
    );
    
    console.log('📊 Available Models:\n');
    
    const models = response.data.models || [];
    
    if (models.length === 0) {
      console.log('❌ No models found. Check your API key.');
      return;
    }
    
    models.forEach((model, index) => {
      console.log(`${index + 1}. ${model.name}`);
      console.log(`   Display Name: ${model.displayName}`);
      console.log(`   Description: ${model.description}`);
      
      if (model.supportedGenerationMethods) {
        console.log(`   Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
      }
      
      console.log('');
    });
    
    // Find models that support generateContent
    const contentModels = models.filter(m => 
      m.supportedGenerationMethods && 
      m.supportedGenerationMethods.includes('generateContent')
    );
    
    console.log('✅ Models that support generateContent:\n');
    contentModels.forEach(model => {
      console.log(`   - ${model.name}`);
    });
    
    if (contentModels.length > 0) {
      console.log('\n💡 Recommended model to use:');
      console.log(`   ${contentModels[0].name}\n`);
    }
    
  } catch (error) {
    console.error('❌ Error fetching models:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.error?.message || error.message);
    
    if (error.response?.status === 403) {
      console.log('\n💡 Your API key might be invalid or expired.');
      console.log('   Get a new key from: https://makersuite.google.com/app/apikey');
    }
  }
};

listModels();
