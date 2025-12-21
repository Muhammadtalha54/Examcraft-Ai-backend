const express = require('express');
const { generateMCQText, generateMCQ, generateShortAnswer, generateLongAnswer } = require('../controllers/generate.controller');

const router = express.Router();

router.post('/mcq-text', generateMCQText);
router.post('/mcq', generateMCQ);
router.post('/short', generateShortAnswer);
router.post('/long', generateLongAnswer);

module.exports = router;
