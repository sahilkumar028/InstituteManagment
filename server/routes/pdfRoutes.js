const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const multer = require('multer');

// Configure multer for PDF upload
const uploadpdf = multer({ storage: multer.memoryStorage() });

// Split PDF into odd pages
router.post('/split/odd', uploadpdf.single('pdf'), pdfController.splitOdd);

// Split PDF into even pages
router.post('/split/even', uploadpdf.single('pdf'), pdfController.splitEven);

// Add a test route to verify the API is working
router.get('/test', (req, res) => {
    res.json({ message: 'PDF API is working' });
});

module.exports = router; 