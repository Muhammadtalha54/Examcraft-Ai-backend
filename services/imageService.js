const Tesseract = require('tesseract.js');

// Extract text from image using OCR
const extractTextFromImage = async (buffer) => {
  try {
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
      logger: m => console.log(m)
    });

    const cleanedText = text.trim();

    if (cleanedText.length < 30) {
      throw new Error('Image text is unclear. Please upload a clear, well-structured image.');
    }

    return cleanedText;
  } catch (error) {
    throw new Error('Failed to extract text from image: ' + error.message);
  }
};

module.exports = {
  extractTextFromImage
};