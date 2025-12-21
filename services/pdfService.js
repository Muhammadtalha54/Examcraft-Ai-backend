const pdfParse = require('pdf-parse');

// Extract and clean text from PDF buffer
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    let text = data.text;

    // Clean extracted text
    text = cleanExtractedText(text);

    if (text.length < 50) {
      throw new Error('PDF content is too short or unreadable');
    }

    return text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
};

// Clean extracted text by removing unwanted elements
const cleanExtractedText = (text) => {
  return text
    .replace(/Page \d+/gi, '') // Remove page numbers
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines
    .replace(/\s{3,}/g, ' ') // Replace multiple spaces
    .trim();
};

module.exports = {
  extractTextFromPDF,
  cleanExtractedText
};