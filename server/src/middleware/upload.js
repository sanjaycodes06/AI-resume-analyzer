const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'application/pdf') {
    callback(null, true);
  } else {
    callback(new Error('Only PDF files are accepted.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;