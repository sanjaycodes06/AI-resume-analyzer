/**
 * services/pdfService.js
 * ────────────────────────
 * Extracts plain text from a PDF buffer using pdf-parse.
 *
 * pdf-parse correct usage:
 *   - Import the function directly with require('pdf-parse')
 *   - Call it as a function: pdfParse(buffer)
 *   - It returns a promise that resolves to an object with a .text property
 */

const pdfParse = require('pdf-parse');

/**
 * extractTextFromPdf
 * @param {Buffer} pdfBuffer - Raw PDF bytes from multer memoryStorage (req.file.buffer)
 * @returns {Promise<string>} - Extracted plain text, or empty string if nothing found
 */
async function extractTextFromPdf(pdfBuffer) {
  // Call pdf-parse directly as a function — do NOT use `new`
  // It reads the buffer and extracts the text layer from the PDF
  const data = await pdfParse(pdfBuffer);

  // data.text contains all the extracted text as a single string
  const text = data.text ? data.text.trim() : '';

  return text;
}

module.exports = { extractTextFromPdf };