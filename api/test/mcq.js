const multer = require('multer');
const { extractTextFromPDF } = require('../../services/pdfService');
const { extractTextFromImage } = require('../../services/imageService');
const { generateMCQ } = require('../../services/geminiService');
const { successResponse, errorResponse } = require('../../utils/responseFormatter');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Generate MCQs for practice test mode
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json(errorResponse('File upload failed'));
    }

    try {
      const { totalQuestions, difficulty } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json(errorResponse('File is required'));
      }

      let text = '';

      if (file.mimetype.includes('pdf')) {
        text = await extractTextFromPDF(file.buffer);
      } else if (file.mimetype.includes('image')) {
        text = await extractTextFromImage(file.buffer);
      } else {
        return res.status(400).json(errorResponse('Unsupported file type'));
      }

      const mcqs = await generateMCQ(text, totalQuestions, difficulty);

      return res.status(200).json(successResponse('MCQ test generated', { mcqs }));

    } catch (e) {
      return res.status(500).json(errorResponse('Failed to generate MCQ test'));
    }
  });
};