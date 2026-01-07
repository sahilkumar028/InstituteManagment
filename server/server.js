const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const studentRoutes = require('./routes/studentRoutes');
const issuedCertificateRoutes = require('./routes/issuedCertificateRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const feesPaymentRoutes = require('./routes/feesPaymentRoutes');
const imageRoutes = require('./routes/imageRoutes');
const logger = require('./middleware/logger');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(logger);

// Routes
app.use('/', studentRoutes);
app.use('/', issuedCertificateRoutes);
app.use('/', pdfRoutes);
app.use('/', feesPaymentRoutes);
app.use('/', imageRoutes);
app.use('/api/student-data', require('./routes/studentData'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server and connect to MongoDB
const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();