const { getPrivacyPolicy, getTermsAndConditions } = require('../services/infoService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// Consolidated info handler for privacy and terms
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const action = pathname.split('/').pop();

  try {
    switch (action) {
      case 'privacy':
        const privacyPolicy = getPrivacyPolicy();
        return res.status(200).json(successResponse('Privacy policy retrieved successfully', privacyPolicy));

      case 'terms':
        const terms = getTermsAndConditions();
        return res.status(200).json(successResponse('Terms and conditions retrieved successfully', terms));

      default:
        return res.status(404).json(errorResponse('Info endpoint not found'));
    }
  } catch (error) {
    res.status(500).json(errorResponse('Failed to retrieve information'));
  }
};