const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        enum: ['registration', 'course_fee', 'other'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'online', 'cheque'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema); 