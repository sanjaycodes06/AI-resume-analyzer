const { model } = require('../config/gemini');

async function analyzeResumeWithGemini(resumeText, jobDescription) {
  const resumeSection = resumeText
    ? `RESUME TEXT:\n${resumeText}`
    : `RESUME TEXT: Not provided.`;

  const jobSection = jobDescription
    ? `JOB DESCRIPTION:\n${jobDescription}`
    : `JOB DESCRIPTION: Not provided.`;

  let instruction = '';
  if (resumeText && jobDescription) {
    instruction = 'Do a full ATS keyword match between the resume and job description.';
  } else if (resumeText && !jobDescription) {
    instruction = 'No job description given. Do a general resume quality review. Score out of 100 based on clarity, structure, and impact. Leave missingSkills as an empty array.';
  } else {
    instruction = 'No resume given. Set atsScore to 0. List the key skills a candidate needs for this role in missingSkills. Leave strengths empty.';
  }

  const prompt = `
You are an expert ATS evaluator and career coach.

${resumeSection}

${jobSection}

Task: ${instruction}

Return ONLY a valid JSON object — no markdown, no code fences, no text outside the JSON.

{
  "atsScore": <integer 0-100>,
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

- atsScore: honest score
- Each array: max 5-8 items, each item under 15 words
- Return ONLY the JSON, nothing else
`;

  let responseText = '';

  try {
    const result = await model.generateContent(prompt);
    responseText = result.response.text();
  } catch (apiError) {
    // Log the full error details to the terminal
    console.error('Gemini API call failed:');
    console.error('Message:', apiError.message);
    console.error('Stack:',   apiError.stack);
    console.error('Response:', apiError.response ?? 'No response attached');

    // Re-throw the original error — do not replace with a generic message
    throw apiError;
  }

  // Strip markdown fences if present
  const cleaned = responseText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  // Extract JSON object from response
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Raw Gemini response:', responseText);
    throw new Error('AI returned an unexpected format. Please try again.');
  }

  let analysis;
  try {
    analysis = JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    console.error('JSON parse failed. Raw:', responseText);
    throw new Error('Failed to parse AI response. Please try again.');
  }

  // Validate all fields exist
  const requiredFields = ['atsScore', 'missingSkills', 'strengths', 'weaknesses', 'suggestions'];
  for (const field of requiredFields) {
    if (!(field in analysis)) {
      throw new Error(`AI response missing field: "${field}". Please try again.`);
    }
  }

  return analysis;
}

module.exports = { analyzeResumeWithGemini };