const { generateMCQ, generateShort, generateLong } = require('../services/geminiService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

exports.generateMCQText = async (req, res) => {
  try {
    const { content, count = 5, difficulty = 'medium' } = req.body;
    
    if (!content) {
      return res.status(400).json(errorResponse('Content is required'));
    }
    
    const mcqs = await generateMCQ(content, parseInt(count), difficulty);
    res.status(200).json(successResponse('MCQs generated successfully', mcqs));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

exports.generateMCQ = async (req, res) => {
  try {
    const { content, count = 5, difficulty = 'medium' } = req.body;
    
    if (!content) {
      return res.status(400).json(errorResponse('Content is required'));
    }
    
    const mcqs = await generateMCQ(content, parseInt(count), difficulty);
    res.status(200).json(successResponse('MCQs generated successfully', mcqs));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

exports.generateShortAnswer = async (req, res) => {
  try {
    const { content, count = 5, difficulty = 'medium' } = req.body;
    
    if (!content) {
      return res.status(400).json(errorResponse('Content is required'));
    }
    
    const questions = await generateShort(content, parseInt(count), difficulty);
    res.status(200).json(successResponse('Short answer questions generated successfully', questions));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

exports.generateLongAnswer = async (req, res) => {
  try {
    const { content, count = 3, difficulty = 'medium' } = req.body;
    
    if (!content) {
      return res.status(400).json(errorResponse('Content is required'));
    }
    
    const questions = await generateLong(content, parseInt(count), difficulty);
    res.status(200).json(successResponse('Long answer questions generated successfully', questions));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};
