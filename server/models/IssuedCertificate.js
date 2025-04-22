const mongoose = require('mongoose');

const issuedCertificateSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    registration: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    fathersname: {
        type: String,
        required: true
    },
    mothersname: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    rollno: {
        type: String,
        required: true
    },
    erollno: {
        type: String,
        required: true
    },
    IssueSession: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    performance: {
        type: String,
        required: true
    },
    certificate: {
        type: String,
        required: true
    },
    Grade: {
        type: String,
        required: true
    },
    IssueDay: {
        type: Number,
        required: true
    },
    IssueMonth: {
        type: String,
        required: true
    },
    IssueYear: {
        type: Number,
        required: true
    },
    rows: [{
        subject: String,
        theory: Number,
        practical: Number,
        obtained: Number
    }],
    photo: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('IssuedCertificate', issuedCertificateSchema); 