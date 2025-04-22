const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const studentRoutes = require('./routes/studentRoutes');
const issuedCertificateRoutes = require('./routes/issuedCertificateRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
(async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
})();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', studentRoutes);
app.use('/', issuedCertificateRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});