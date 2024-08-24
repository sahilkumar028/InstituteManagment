const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const Student = require('./models/Student');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/institute", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads

// Route to handle form submission
app.post('/add-student', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'marksheet', maxCount: 1 },
    { name: 'aadhaar', maxCount: 1 }
]), async (req, res) => {
    try {
        const { date, name, fatherName, motherName, dob, age, email, phone, address, course, fees, duration, durationOption, reference } = req.body;
        const files = req.files;
        const photoPath = files['photo'] ? files['photo'][0].filename : null;
        const marksheetPath = files['marksheet'] ? files['marksheet'][0].filename : null;
        const aadhaarPath = files['aadhaar'] ? files['aadhaar'][0].filename : null;
        // console.log(file['photo'][0]);
        const student = new Student({
            date: new Date(date),
            name,
            fatherName,
            motherName,
            dob: new Date(dob),
            age,
            email,
            phone,
            address,
            course,
            fees,
            duration,
            durationOption,
            photo: photoPath,
            marksheet: marksheetPath,
            aadhaar: aadhaarPath,
            reference
        });

        const savedStudent = await student.save();
        res.status(200).json({ message: 'Student added successfully', studentId: savedStudent.regId });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add student', error });
    }
});

// Endpoint to get the list of students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve students', error });
    }
});

// Route to mark a student's course as complete
app.put('/api/students/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.courseStatus = 'Complete'; // Add or update the field as needed
        await student.save();
        
        res.status(200).json({ message: 'Course status updated to Complete', student });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update course status', error });
    }
});

// Define the route to get a student by ID
app.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete student by ID
app.delete('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete student', error });
    }
});

// Define the route to get an image by file name
app.get('/api/images/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', filename);

    res.sendFile(filePath, err => {
        if (err) {
            res.status(404).json({ message: 'Image not found' });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
