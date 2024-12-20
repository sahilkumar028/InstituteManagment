const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: String, required: true },
    remarks: { type: String, required: false }
}, { strict: true }); // You can remove { strict: false } since we're now using fixed fields

module.exports = mongoose.model('Enquiry', enquirySchema);
