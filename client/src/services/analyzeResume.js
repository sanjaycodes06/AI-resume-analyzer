import axios from 'axios';

const BACKEND_URL = 'https://ai-resume-analyzer-6spk.onrender.com/';

export async function analyzeResume(resumeFile, jobDescription) {
  const formData = new FormData();
  if (resumeFile) {
    formData.append('resume', resumeFile);
  }
  formData.append('jobDescription', jobDescription || '');

  const response = await axios.post(`${BACKEND_URL}/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}
