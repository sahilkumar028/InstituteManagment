const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    sequence_value: { type: Number, default: 4000 }
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
