const express = require('express');
const router  = express.Router();

const upload            = require('../middleware/upload');
const { analyzeResume } = require('../controllers/analyzeController');

// upload.single() — req.file is undefined if no file sent, no crash
router.post('/', upload.single('resume'), analyzeResume);

module.exports = router;