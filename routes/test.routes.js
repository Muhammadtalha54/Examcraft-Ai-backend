const express = require('express');
const { evaluateMCQ } = require('../controllers/test.controller');

const router = express.Router();

router.post('/mcq', evaluateMCQ);

module.exports = router;
