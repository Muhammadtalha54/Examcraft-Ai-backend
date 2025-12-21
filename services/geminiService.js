const axios = require('axios');
const { GEMINI_API_KEY } = require('../config/env');

// Check if API key is configured
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in environment variables!');
}

// Using gemini-2.5-flash (confirmed available via list-gemini-models.js)
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Call Gemini API with retry logic
const callGeminiAPI = async (prompt, retries = 3) => {
  // Check if API key exists
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined') {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file');
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Calling Gemini API (attempt ${i + 1}/${retries})...`);
      
      const response = await axios.post(GEMINI_API_URL, {
        contents: [{ parts: [{ text: prompt }] }]
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const text = response.data.candidates[0].content.parts[0].text;
      console.log('✅ Gemini API call successful');
      return text;
    } catch (error) {
      console.error(`❌ Gemini API error (attempt ${i + 1}):`, error.response?.data || error.message);
      
      // Log detailed error information
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      }
      
      if (i === retries - 1) {
        // Provide more helpful error message
        if (error.response?.status === 400) {
          throw new Error(`Gemini API error: ${error.response.data.error?.message || 'Invalid request. Check your API key and request format.'}`);
        } else if (error.response?.status === 403) {
          throw new Error('Gemini API key is invalid or doesn\'t have permission. Please check your GEMINI_API_KEY in .env file');
        } else if (error.response?.status === 429) {
          throw new Error('Gemini API rate limit exceeded. Please try again later');
        } else {
          throw new Error(`Gemini API failed: ${error.response?.data?.error?.message || error.message}`);
        }
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Generate MCQs from text content
const generateMCQ = async (text, count, difficulty) => {
  const prompt = `Generate exactly ${count} multiple choice questions from the following text. Difficulty: ${difficulty}.
Return ONLY valid JSON in this exact format:
{
  "mcqs": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    }
  ]
}

Text: ${text}`;

  const response = await callGeminiAPI(prompt);
  return parseJSONResponse(response);
};

// Generate short questions from text content
const generateShort = async (text, count, difficulty) => {
  const prompt = `Generate exactly ${count} short answer questions from the following text. Difficulty: ${difficulty}.
Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "answer": "Brief answer here"
    }
  ]
}

Text: ${text}`;

  const response = await callGeminiAPI(prompt);
  return parseJSONResponse(response);
};

// Generate long questions from text content
const generateLong = async (text, count, difficulty) => {
  const prompt = `Generate exactly ${count} long answer questions from the following text. Difficulty: ${difficulty}.
Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "answer": "Detailed answer here"
    }
  ]
}

Text: ${text}`;

  const response = await callGeminiAPI(prompt);
  return parseJSONResponse(response);
};

// Parse and validate JSON response from Gemini
const parseJSONResponse = (text) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw new Error('Failed to parse Gemini response as JSON');
  }
};

module.exports = {
  generateMCQ,
  generateShort,
  generateLong
};