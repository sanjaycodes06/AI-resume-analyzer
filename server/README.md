# AI Resume Analyzer — Backend

Node.js + Express backend that accepts a PDF resume and job description,
extracts the text, and uses the **Google Gemini API** to return a structured ATS analysis.

---

## Folder Structure

```
resume-backend/
├── src/
│   ├── server.js                  ← Entry point, Express app setup
│   ├── config/
│   │   └── gemini.js              ← Gemini AI client initialization
│   ├── routes/
│   │   └── analyze.js             ← POST /analyze route definition
│   ├── controllers/
│   │   └── analyzeController.js   ← Request handler, input validation
│   ├── services/
│   │   ├── pdfService.js          ← PDF text extraction logic
│   │   └── geminiService.js       ← Gemini API call + prompt logic
│   └── middleware/
│       └── upload.js              ← Multer file upload configuration
├── frontend-integration/
│   └── analyzeResume.js           ← Drop-in replacement for your React service file
├── .env.example                   ← Environment variable template
├── .gitignore
└── package.json
```

---

## Setup Instructions

### 1. Get a Gemini API key (free)
1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API Key**
3. Copy the key

### 2. Configure environment variables
```bash
cp .env.example .env
```
Open `.env` and replace `your_gemini_api_key_here` with your actual key:
```
GEMINI_API_KEY=AIzaSy...your_key_here
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the server
```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

You should see:
```
🚀 Resume Analyzer API running
   Local:  http://localhost:5000
   Health: http://localhost:5000/health
```

---

## API Endpoints

### `GET /health`
Confirms the server is running.
```json
{ "status": "ok", "message": "Resume Analyzer API is running." }
```

### `POST /analyze`
Analyzes a resume against a job description.

**Request** — `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| `resume` | File (PDF) | The candidate's resume, max 5 MB |
| `jobDescription` | String | The full job posting text |

**Success Response** — `200 OK`
```json
{
  "atsScore": 82,
  "missingSkills": ["Kubernetes", "Terraform", "GraphQL"],
  "strengths": ["Strong React experience", "CI/CD pipeline knowledge"],
  "weaknesses": ["No cloud certifications listed", "Missing quantified achievements"],
  "suggestions": ["Add AWS or GCP certification", "Quantify impact with metrics"]
}
```

**Error Response** — `400 / 500`
```json
{ "error": "No resume file uploaded. Please attach a PDF file." }
```

---

## Testing with curl
```bash
curl -X POST http://localhost:5000/analyze \
  -F "resume=@/path/to/resume.pdf" \
  -F "jobDescription=We are looking for a React developer with 3+ years experience..."
```

---

## Frontend Integration

Replace `src/services/analyzeResume.js` in your React app with the file in `frontend-integration/analyzeResume.js`.

Update your App.jsx call:
```jsx
// OLD — passed API key, sent file buffer
const data = await analyzeResume(pdfText, jobDescription, apiKey);

// NEW — passes the actual File object, no API key needed
const data = await analyzeResume(selectedFile, jobDescription);
```

Remove the API key input field from your UI entirely — it's no longer needed.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | — | Your Google Gemini API key |
| `PORT` | No | `5000` | Port the server listens on |
| `FRONTEND_URL` | No | `http://localhost:5173` | Allowed CORS origin |
