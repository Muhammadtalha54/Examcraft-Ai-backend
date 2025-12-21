const { getPrivacyPolicy, getTermsAndConditions } = require('../services/infoService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

exports.getPrivacy = async (req, res) => {
  try {
    const policy = getPrivacyPolicy();
    res.status(200).json(successResponse('Privacy policy retrieved', policy));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

exports.getTerms = async (req, res) => {
  try {
    const terms = getTermsAndConditions();
    res.status(200).json(successResponse('Terms of service retrieved', terms));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};
