const express = require('express');
const { getPrivacy, getTerms } = require('../controllers/info.controller');

const router = express.Router();

router.get('/privacy', getPrivacy);
router.get('/terms', getTerms);

module.exports = router;
