const multer = require('multer');
const { extractTextFromPDF } = require('../../services/pdfService');
const { extractTextFromImage } = require('../../services/imageService');
const { generateShort } = require('../../services/geminiService');
const { isValidFileType } = require('../../utils/validator');
const { successResponse, errorResponse } = require('../../utils/responseFormatter');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Generate short questions from uploaded PDF or image
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json(errorResponse('File upload failed: ' + err.message));
    }

    try {
      const { count = 5, difficulty = 'medium' } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json(errorResponse('Please upload a PDF or image file'));
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!isValidFileType(file.mimetype, allowedTypes)) {
        return res.status(400).json(errorResponse('Only PDF and image files are allowed'));
      }

      let extractedText;
      if (file.mimetype === 'application/pdf') {
        extractedText = await extractTextFromPDF(file.buffer);
      } else {
        extractedText = await extractTextFromImage(file.buffer);
      }

      const questions = await generateShort(extractedText, parseInt(count), difficulty);

      res.status(200).json(successResponse('Short questions generated successfully', questions));
    } catch (error) {
      res.status(500).json(errorResponse(error.message));
    }
  });
};