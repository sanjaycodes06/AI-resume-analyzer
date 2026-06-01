require('dotenv').config();

const express = require('express');
const cors = require('cors');
const analyzeRoute = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS FIX
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://ai-resume-analyzer-rosy-phi.vercel.app'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Resume Analyzer Backend Running' });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Resume Analyzer API is running.'
  });
});

app.use('/analyze', analyzeRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  res.status(500).json({
    error: err.message || 'Internal server error.'
  });
});

app.listen(PORT, () => {
  console.log('🚀 Resume Analyzer API running');
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
});