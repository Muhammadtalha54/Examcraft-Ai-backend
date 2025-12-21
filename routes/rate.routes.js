const express = require('express');
const { submitRating } = require('../controllers/rate.controller');

const router = express.Router();

router.post('/', submitRating);

module.exports = router;
