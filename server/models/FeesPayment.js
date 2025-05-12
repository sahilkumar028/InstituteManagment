const mongoose = require('mongoose');

const feesPaymentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash', 'Online', 'Cheque']
    },
    receiptNumber: {
        type: String,
        required: true,
        unique: true
    },
    fatherName: {
        type: String,
        required: true
    },
    remarks: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Completed'
    }
}, {
    timestamps: true
});

// Pre-save hook to generate receipt number
feesPaymentSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const today = new Date();
            const year = today.getFullYear().toString().slice(-2);
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            
            // Check if we need to reset the series (after March 31st)
            const isNewYear = today.getMonth() >= 3; // 3 is April (0-based)
            const seriesYear = isNewYear ? year : (parseInt(year) - 1).toString();
            
            // Get the count of payments for the current series
            const count = await this.constructor.countDocuments({
                receiptNumber: new RegExp(`^SIMT${seriesYear}${month}`)
            });
            
            // Generate receipt number in format: SIMT{YY}{MM}**** starting from 1001
            const newReceiptNumber = `SIMT${seriesYear}${month}${(count + 1001).toString().padStart(4, '0')}`;
            
            // Set the receipt number before validation
            this.receiptNumber = newReceiptNumber;
            
            // Verify the receipt number is unique
            const existingPayment = await this.constructor.findOne({ receiptNumber: newReceiptNumber });
            if (existingPayment) {
                // If duplicate found, increment the count and try again
                const newCount = count + 1;
                this.receiptNumber = `SIMT${seriesYear}${month}${(newCount + 1001).toString().padStart(4, '0')}`;
            }
        } catch (err) {
            return next(err);
        }
    }
    next();
});

// Pre-validate hook to ensure receipt number is set
feesPaymentSchema.pre('validate', function(next) {
    if (this.isNew && !this.receiptNumber) {
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const isNewYear = today.getMonth() >= 3;
        const seriesYear = isNewYear ? year : (parseInt(year) - 1).toString();
        
        // Set a temporary receipt number if none exists
        this.receiptNumber = `SIMT${seriesYear}${month}1001`;
    }
    next();
});

module.exports = mongoose.model('FeesPayment', feesPaymentSchema); 