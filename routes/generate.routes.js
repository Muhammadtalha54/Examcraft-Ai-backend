const express = require('express');
const { generateMCQText, generateMCQ, generateShortAnswer, generateLongAnswer } = require('../controllers/generate.controller');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// All routes support both text content and PDF file upload
router.post('/mcq-text', upload.single('file'), generateMCQText);
router.post('/mcq', upload.single('file'), generateMCQ);
router.post('/short', upload.single('file'), generateShortAnswer);
router.post('/long', upload.single('file'), generateLongAnswer);

module.exports = router;
