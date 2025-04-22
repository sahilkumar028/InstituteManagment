const express = require('express');
const router = express.Router();
const issuedCertificateController = require('../controllers/issuedCertificateController');

// Get all issued certificates
router.get('/api/issued', issuedCertificateController.getAllIssuedCertificates);

// Get certificate by ID
router.get('/api/issued/:id', issuedCertificateController.getCertificateById);

// Generate and download certificate (using original endpoint)
router.get('/createCertificate/:registration', issuedCertificateController.issueCertificate);

// Delete certificate
router.delete('/api/issued/:id', issuedCertificateController.deleteCertificate);

module.exports = router; 