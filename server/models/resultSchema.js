const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    photo: {
        type: String,
        required: false
    },
    registration: {
        type: String,
        required: true,
        unique:false
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
        type: String,
        required: true
    },
    rollno: {
        type: String,
        required: true
    },
    erollno: {
        type: String,
        required: true,
        unique: true
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
        type: String,
        required: true
    },
    IssueYear: {
        type: String,
        required: true
    },
    IssueMonth: {
        type: String,
        required: true
    },
    rows: [{
        subject: String,
        theory: Number,
        practical: Number,
        obtained: Number
    }]
}, {
    timestamps: true,
    collection: 'result'
});

const Result = mongoose.model('Result', resultSchema, 'result');

module.exports = Result; 