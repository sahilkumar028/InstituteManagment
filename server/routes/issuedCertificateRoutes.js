const express = require('express');
const router = express.Router();
const Result = require('../models/resultSchema');
const Student = require('../models/Student');
const { generateCertificate } = require('../controllers/issuedCertificateController');
const fs = require('fs');

// Get all certificates
router.get('/api/issued', async (req, res) => {
    try {
        const certificates = await Result.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: certificates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching certificates',
            error: error.message
        });
    }
});

// Get certificate by registration number
router.get('/api/issued/:registration', async (req, res) => {
    try {
        const certificate = await Result.findOne({ registration: req.params.registration });
        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }
        res.json({
            success: true,
            data: certificate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching certificate',
            error: error.message
        });
    }
});

// Save certificate
router.post('/api/issued', async (req, res) => {
    console.log('=== Saving Certificate ===');
    try {
        const {
            registration,
            name,
            fathersname,
            mothersname,
            dob,
            rollno,
            erollno,
            IssueSession,
            duration,
            certificate,
            rows,
            performance,
            Grade,
            IssueDay,
            IssueMonth,
            IssueYear
        } = req.body;

        console.log('Received data:', {
            registration,
            name,
            certificate,
            subjects: rows.length
        });

        // Validate required fields
        if (!registration || !name || !certificate || !rows || rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if certificate already exists
        const existingCertificate = await Result.findOne({ registration });
        if (existingCertificate) {
            return res.status(400).json({
                success: false,
                message: 'Certificate already exists for this student'
            });
        }

        // Get student's photo from Student collection
        const student = await Student.findOne({ regId: registration });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Create new certificate
        const newCertificate = new Result({
            studentId: registration,
            registration,
            name,
            fathersname,
            mothersname,
            dob: new Date(dob),
            rollno,
            erollno,
            IssueSession,
            duration,
            certificate,
            subjects: rows.map(row => ({
                subject: row.subject,
                theory: parseInt(row.theory) || 0,
                practical: parseInt(row.practical) || 0,
                obtained: parseInt(row.obtained) || 0
            })),
            performance,
            Grade,
            IssueDay,
            IssueMonth,
            IssueYear,
            photo: student.photo || null // Use student's photo if available
        });

        // Save to database
        await newCertificate.save();
        console.log('Certificate saved successfully');

        // Update student's course status
        await Student.findOneAndUpdate(
            { regId: registration },
            { courseStatus: 'Complete' }
        );
        console.log('Student course status updated to Complete');

        res.status(201).json({
            success: true,
            message: 'Certificate saved successfully',
            data: newCertificate
        });

    } catch (error) {
        console.error('Error saving certificate:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving certificate',
            error: error.message
        });
    }
});

// Delete certificate
router.delete('/api/issued/:registration', async (req, res) => {
    try {
        const certificate = await Result.findOneAndDelete({ registration: req.params.registration });
        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }
        res.json({
            success: true,
            message: 'Certificate deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting certificate',
            error: error.message
        });
    }
});

// Create certificate by registration number
router.get('/api/createCertificate/:registration', async (req, res) => {
    try {
        const { registration } = req.params;
        
        // Find the student
        const student = await Student.findOne({ regId: registration });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Find the result/certificate
        const result = await Result.findOne({ registration });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Result not found for this student'
            });
        }

        // Generate the certificate
        const certificatePath = await generateCertificate(registration);
        
        // Send the certificate file
        res.download(certificatePath, `certificate_${registration}.pdf`, (err) => {
            if (err) {
                console.error('Error sending certificate:', err);
                res.status(500).json({
                    success: false,
                    message: 'Error sending certificate file'
                });
            }
            // Clean up the temporary file after sending
            fs.unlink(certificatePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error deleting temporary certificate:', unlinkErr);
                }
            });
        });

    } catch (error) {
        console.error('Error creating certificate:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating certificate',
            error: error.message
        });
    }
});

module.exports = router; 