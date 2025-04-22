const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const studentDbUrl = "mongodb://127.0.0.1:27017/institute";
        await mongoose.connect(studentDbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected for student data');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB; 