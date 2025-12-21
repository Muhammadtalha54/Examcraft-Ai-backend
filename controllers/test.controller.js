const { successResponse, errorResponse } = require('../utils/responseFormatter');

exports.evaluateMCQ = async (req, res) => {
  try {
    const { questions, answers } = req.body;
    
    if (!questions || !answers) {
      return res.status(400).json(errorResponse('Questions and answers are required'));
    }
    
    // Simple scoring logic
    let score = 0;
    const results = questions.map((q, index) => {
      const isCorrect = answers[index] === q.correctAnswer;
      if (isCorrect) score++;
      return {
        question: q.question,
        userAnswer: answers[index],
        correctAnswer: q.correctAnswer,
        isCorrect
      };
    });
    
    const percentage = Math.round((score / questions.length) * 100);
    
    res.status(200).json(successResponse('Test evaluated successfully', {
      score,
      total: questions.length,
      percentage,
      results
    }));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};
