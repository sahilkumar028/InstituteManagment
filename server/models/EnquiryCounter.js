const mongoose = require('mongoose');

// Define the Counter schema to track serial numbers for each day
const counterSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },  // DDMMYY format
  serialNumber: { type: Number, default: 0 },
});

const EnquiryCounter = mongoose.model('EnquiryCounter', counterSchema);

module.exports = EnquiryCounter;
