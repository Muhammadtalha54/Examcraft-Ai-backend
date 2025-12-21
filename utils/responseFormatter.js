// Format success response
const successResponse = (message, data = null) => {
  return {
    success: true,
    message,
    data
  };
};

// Format error response
const errorResponse = (message, data = null) => {
  return {
    success: false,
    message,
    data
  };
};

// Handle async errors in routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  successResponse,
  errorResponse,
  asyncHandler
};