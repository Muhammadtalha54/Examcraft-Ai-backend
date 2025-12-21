const { getPrivacyPolicy } = require('../../services/infoService');
const { successResponse, errorResponse } = require('../../utils/responseFormatter');

// Get privacy policy content
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  try {
    const privacyPolicy = getPrivacyPolicy();
    res.status(200).json(successResponse('Privacy policy retrieved successfully', privacyPolicy));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to retrieve privacy policy'));
  }
};