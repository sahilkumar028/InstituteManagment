const express = require('express');
const router = express.Router();
const FeesPayment = require('../models/FeesPayment');
const Student = require('../models/Student');
const { generatePaymentSlip } = require('../services/pdfService');
const path = require('path');
const fs = require('fs');

// Create a new fee payment
router.post('/fees-payment', async (req, res) => {
    try {
        const { studentId, amount, paymentMethod, remarks } = req.body;

        // Validate student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const payment = new FeesPayment({
            studentId,
            amount,
            paymentMethod,
            remarks,
            fatherName: student.fatherName
        });

        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get all fee payments
router.get('/fees-payments', async (req, res) => {
    try {
        const payments = await FeesPayment.find()
            .populate('studentId', 'regId name course')
            .sort({ paymentDate: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get fee payments by student ID
router.get('/fees-payments/student/:studentId', async (req, res) => {
    try {
        const payments = await FeesPayment.find({ studentId: req.params.studentId })
            .populate('studentId', 'regId name course')
            .sort({ paymentDate: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single fee payment by ID
router.get('/fees-payment/:id', async (req, res) => {
    try {
        const payment = await FeesPayment.findById(req.params.id)
            .populate('studentId', 'regId name course');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a fee payment
router.put('/fees-payment/:id', async (req, res) => {
    try {
        const { amount, paymentMethod, remarks, status } = req.body;
        const payment = await FeesPayment.findById(req.params.id);
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        if (amount) payment.amount = amount;
        if (paymentMethod) payment.paymentMethod = paymentMethod;
        if (remarks) payment.remarks = remarks;
        if (status) payment.status = status;

        await payment.save();
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a fee payment
router.delete('/fees-payment/:id', async (req, res) => {
    try {
        const payment = await FeesPayment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        await payment.remove();
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get payment summary for a student
router.get('/fees-payments/summary/:studentId', async (req, res) => {
    try {
        const payments = await FeesPayment.find({ studentId: req.params.studentId })
            .populate('studentId', 'regId name course')
            .sort({ paymentDate: -1 });

        const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

        res.json({
            student: payments[0]?.studentId,
            totalPaid,
            payments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Generate and download payment slip
router.get('/fees-payment/:id/slip', async (req, res) => {
    try {
        const payment = await FeesPayment.findById(req.params.id)
            .populate('studentId', 'regId name course');
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        const fileName = await generatePaymentSlip(payment, payment.studentId);
        const filePath = path.join(__dirname, '../uploads', fileName);

        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).json({ message: 'Error downloading file' });
            }
            // Clean up the file after download
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error deleting file:', unlinkErr);
                }
            });
        });
    } catch (error) {
        console.error('Error generating slip:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 