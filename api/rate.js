const connectDB = require('../config/db');
const { saveRating, getRatingStats } = require('../services/ratingService');
const { isValidRating } = require('../utils/validator');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// Handle app rating submission and retrieval
module.exports = async (req, res) => {
  await connectDB();

  if (req.method === 'POST') {
    // Submit new rating
    try {
      const { userId, rating, comment } = req.body;

      if (!rating) {
        return res.status(400).json(errorResponse('Rating is required'));
      }

      if (!isValidRating(rating)) {
        return res.status(400).json(errorResponse('Rating must be between 1 and 5'));
      }

      const newRating = await saveRating(userId, rating, comment);

      res.status(201).json(successResponse('Rating submitted successfully', {
        id: newRating._id,
        rating: newRating.rating,
        comment: newRating.comment
      }));
    } catch (error) {
      res.status(500).json(errorResponse(error.message));
    }
  } else if (req.method === 'GET') {
    // Get rating statistics
    try {
      const stats = await getRatingStats();
      res.status(200).json(successResponse('Rating stats retrieved successfully', stats));
    } catch (error) {
      res.status(500).json(errorResponse(error.message));
    }
  } else {
    res.status(405).json(errorResponse('Method not allowed'));
  }
};