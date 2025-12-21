const { getTermsAndConditions } = require('../../services/infoService');
const { successResponse, errorResponse } = require('../../utils/responseFormatter');

// Get terms and conditions content
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  try {
    const terms = getTermsAndConditions();
    res.status(200).json(successResponse('Terms and conditions retrieved successfully', terms));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to retrieve terms and conditions'));
  }
};