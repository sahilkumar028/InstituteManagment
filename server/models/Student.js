const mongoose = require('mongoose');
const Counter = require('./Counter.js'); // Import the Counter model

const studentSchema = new mongoose.Schema({
    regId: { type: String, unique: true },
    date: { type: Date, required: true },
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    course: { type: String, required: true },
    fees: { type: Number, required: true },
    duration: { type: String, required: true },
    durationOption: { type: String, required: true },
    photo: { type: String },
    marksheet: { type: String },
    aadhaar: { type: String },
    reference: { type: String },
    courseStatus: { type: String, default: 'Incomplete' }
});

// Compound index to ensure unique combination of email, phone, course, and name
studentSchema.index({ email: 1, phone: 1, course: 1, name: 1 }, { unique: true });

// Pre-save hook to generate regId
studentSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            // Fetch current date in ddmmyy format
            const today = new Date();
            const datePart = `${today.getDate().toString().padStart(2, '0')}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getFullYear().toString().slice(-2)}`;

            // Increment the sequence value
            const counter = await Counter.findOneAndUpdate(
                { name: `registrationNumber_${datePart}` }, // Use a separate counter for each date
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true } // Create if it doesn't exist
            );

            if (counter.sequence_value > 9999) {
                throw new Error("Registration number sequence exceeded the limit for the day.");
            }

            // Generate regId in ddmmyy**** format
            const sequencePart = counter.sequence_value.toString().padStart(4, '0');
            this.regId = `${datePart}${sequencePart}`;
        } catch (err) {
            return next(err);
        }
    }
    next();
});

// Custom validation to check for existing students with the same combination
studentSchema.pre('validate', async function (next) {
    if (this.isNew) {
        try {
            const existingStudent = await this.constructor.findOne({
                email: this.email,
                phone: this.phone,
                course: this.course,
                name: this.name
            });

            if (existingStudent) {
                return next(new Error('A student with the same email, phone number, course, and name already exists.'));
            }
        } catch (err) {
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model('Student', studentSchema);
