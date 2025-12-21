const axios = require('axios');
const { GEMINI_API_KEY } = require('../config/env');

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Call Gemini API with retry logic
const callGeminiAPI = async (prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(GEMINI_API_URL, {
        contents: [{ parts: [{ text: prompt }] }]
      }, {
        timeout: 30000
      });

      const text = response.data.candidates[0].content.parts[0].text;
      return text;
    } catch (error) {
      if (i === retries - 1) {
        throw new Error('Gemini API failed after multiple retries');
      }
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