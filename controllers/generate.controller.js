const { generateMCQ, generateShort, generateLong } = require('../services/geminiService');
const { extractTextFromPDF } = require('../services/pdfService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// Helper function to get content from either text or PDF
const getContent = async (req) => {
  // Check if PDF file was uploaded
  if (req.file) {
    const text = await extractTextFromPDF(req.file.buffer);
    return text;
  }
  
  // Otherwise use text content from body
  if (req.body.content) {
    return req.body.content;
  }
  
  throw new Error('Either content or PDF file is required');
};

exports.generateMCQText = async (req, res) => {
  try {
    const content = await getContent(req);
    const { count = 5, difficulty = 'medium' } = req.body;
    
    const mcqs = await generateMCQ(content, parseInt(count), difficulty);
    res.status(200).json(successResponse('MCQs generated successfully', mcqs));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

exports.generateMCQ = async (req, res) => {
  try {
    const content = await getContent(req);
    const { count = 5, difficulty = 'medium' } = req.body;
    
    const mcqs = await generateMCQ(content, parseInt(count), difficulty);
    res.status(200).json(successResponse('MCQs generated successfully', mcqs));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

exports.generateShortAnswer = async (req, res) => {
  try {
    const content = await getContent(req);
    const { count = 5, difficulty = 'medium' } = req.body;
    
    const questions = await generateShort(content, parseInt(count), difficulty);
    res.status(200).json(successResponse('Short answer questions generated successfully', questions));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

exports.generateLongAnswer = async (req, res) => {
  try {
    const content = await getContent(req);
    const { count = 3, difficulty = 'medium' } = req.body;
    
    const questions = await generateLong(content, parseInt(count), difficulty);
    res.status(200).json(successResponse('Long answer questions generated successfully', questions));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

