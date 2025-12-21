const { saveRating } = require('../services/ratingService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

exports.submitRating = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    
    if (!rating) {
      return res.status(400).json(errorResponse('Rating is required'));
    }
    
    await saveRating(null, rating, feedback);
    res.status(200).json(successResponse('Rating submitted successfully'));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};
