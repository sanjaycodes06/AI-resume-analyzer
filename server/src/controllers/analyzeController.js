const { extractTextFromPdf }      = require('../services/pdfService');
const { analyzeResumeWithGemini } = require('../services/geminiService');

async function analyzeResume(req, res) {
  try {
    // Job description is optional
    const jobDescription = (req.body?.jobDescription || '').trim();

    // Resume PDF is optional
    let resumeText = '';

    if (req.file) {
      console.log(`📄 Extracting text from: ${req.file.originalname}`);
      resumeText = await extractTextFromPdf(req.file.buffer);

      if (!resumeText) {
        return res.status(400).json({
          error: 'Could not extract text from this PDF. Please use a text-based PDF (not a scanned image).',
        });
      }
      console.log(`✓  Extracted ${resumeText.length} characters`);
    }

    // Need at least one input
    if (!resumeText && !jobDescription) {
      return res.status(400).json({
        error: 'Please upload a resume PDF or paste a job description (or both).',
      });
    }

    console.log('🤖 Analyzing...');
    console.log(`   Resume: ${resumeText.length} chars | JD: ${jobDescription.length} chars`);

    const analysis = await analyzeResumeWithGemini(resumeText, jobDescription);

    console.log(`✓  Done. ATS Score: ${analysis.atsScore}`);
    return res.status(200).json(analysis);

  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({
      error: error.message || 'Analysis failed. Please try again.',
    });
  }
}

module.exports = { analyzeResume };