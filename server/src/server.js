require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const analyzeRoute = require('./routes/analyze');

const app  = express();
const PORT = process.env.PORT || 5000;

// Allow all localhost origins
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('/', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Resume Analyzer Backend Running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Resume Analyzer API is running.' });
});

app.use('/analyze', analyzeRoute);

// 404 handler — no wildcard, Express calls this when nothing above matched
app.use(function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use(function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Resume Analyzer API running');
  console.log(`   Local:  http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log('');
});