/**
 * config/gemini.js
 * ─────────────────
 * Sets up and exports the Google Gemini AI client.
 * The API key is read from the .env file — never hardcoded.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Read the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;

// Crash early with a clear message if the key is missing
if (!apiKey) {
  console.error('❌  GEMINI_API_KEY is missing from your .env file.');
  console.error('    Copy .env.example → .env and add your key.');
  process.exit(1);
}

// Create the Gemini client
const genAI = new GoogleGenerativeAI(apiKey);

// We'll use the gemini-1.5-flash model — fast and free-tier friendly
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

module.exports = { model };
