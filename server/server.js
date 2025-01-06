const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const Student = require('./models/Student');
const Enquiry = require('./models/Enquiry');
const { MongoClient } = require('mongodb');

const { jsPDF } = require("jspdf");
const fs = require('fs');
const QRCode = require('qrcode');

const client = new MongoClient('mongodb://127.0.0.1:27017');
const dbName = 'institute';

// MongoDB URIs
const studentDbUrl = "mongodb://127.0.0.1:27017/institute";
const formDbUrl = "mongodb://127.0.0.1:27017/form_data";
// Create MongoDB clients
const studentClient = new MongoClient(studentDbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const formClient = new MongoClient(formDbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(studentDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected for student data'))
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


// Add Enquiry route
// Add Enquiry route
const EnquiryCounter = require('./models/EnquiryCounter');

app.post('/add-enquiry', async (req, res) => {
    try {
        const { date, name, phone, course, remarks } = req.body;

        // Validation: Ensure required fields are provided
        if (!date || !name || !phone || !course) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Get current date, month, and year for Enquiry ID (DDMMYY)
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');  // Pad to ensure two digits
        const month = (today.getMonth() + 1).toString().padStart(2, '0');  // Month is 0-indexed, so add 1
        const year = today.getFullYear().toString().slice(-2);  // Get last two digits of the year
        const dateKey = `${day}${month}${year}`;  // Format as DDMMYY

        // Find or create a counter for the current date (DDMMYY)
        let counter = await EnquiryCounter.findOne({ date: dateKey });

        if (!counter) {
            // If no counter exists for this date, create one starting with serial number 1
            counter = new EnquiryCounter({ date: dateKey, serialNumber: 1 });
        } else {
            // If counter exists, increment the serial number
            counter.serialNumber += 1;
        }

        // Save the updated counter
        await counter.save();

        // Generate the enquiryId in the format DDMMYY-XXX
        const enquiryId = `${dateKey}-${counter.serialNumber.toString().padStart(3, '0')}`;

        // Create a new enquiry
        const enquiry = new Enquiry({
            date: new Date(date),
            name,
            phone,
            course,
            remarks,
            enquiryId,  // Save the generated enquiryId
        });

        // Save the enquiry to the database
        const savedEnquiry = await enquiry.save();

        res.status(200).json({ message: 'Enquiry added successfully', enquiryId: savedEnquiry.enquiryId });
    } catch (error) {
        console.error('Error adding enquiry:', error);
        res.status(500).json({ message: 'Failed to add enquiry', error });
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

// Connect to form database and insert data
async function insertData(Data) {
    try {
        await formClient.connect();
        const db = formClient.db('institute');
        const collection = db.collection('result');

        // Check if registration number already exists
        const existingEntry = await collection.findOne({ registration: Data.registration });

        if (existingEntry) {
            throw new Error(`Registration number ${Data.registration} already exists.`);
        }

        // Insert the new data if no existing entry is found
        const result = { ...Data };
        await collection.insertOne(result);
        console.log("Form data inserted successfully");
    } catch (error) {
        console.error("Failed to insert form data", error);
        throw error; // Re-throw error to handle it in the route
    } finally {
        await formClient.close();
    }
}

// POST endpoint for saving data
app.post("/savedata", async (req, res) => {
    try {
        const Data = req.body;
        await insertData(Data);
        console.log(Data);
        res.send("Form data uploaded successfully");
    } catch (error) {
        res.status(400).send(error.message || "Error uploading form data");
    }
});


app.get('/api/issued', async (req, res) => {
    try {
        try {
            await formClient.connect();
            const db = formClient.db('institute');
            const collection = db.collection('result');
            res.json(await collection.find().toArray());
        } catch (error) {
            console.error("Failed to insert form data", error);
        } finally {
            await formClient.close();
        }

    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve issued certificate', error });
    }
});

async function deleteDataByRegistration(registrationNumber) {
    try {
        await formClient.connect();
        const db = formClient.db('institute');
        const collection = db.collection('result');

        // Delete document(s) matching the registration number
        const result = await collection.deleteOne({ registration: registrationNumber });

        if (result.deletedCount === 1) {
            console.log(`Successfully deleted document with registration number: ${registrationNumber}`);
        } else {
            console.log(`No document found with registration number: ${registrationNumber}`);
        }
    } catch (error) {
        console.error("Failed to delete form data", error);
        throw error;
    } finally {
        await formClient.close();
    }
}


app.delete("/deletedata/registration/:registration", async (req, res) => {
    const registrationNumber = req.params.registration; // Extract registration number from URL
    try {
        console.log("check")
        await deleteDataByRegistration(registrationNumber);
        res.send(`Data with registration number: ${registrationNumber} deleted successfully`);
    } catch (error) {
        console.error("Error deleting form data by registration", error);
        res.status(500).send("Error deleting form data");
    }
});

function titleCase(s) {
    return s.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

async function generateQRCode(qrData, qrOptions) {
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(JSON.stringify(qrData), qrOptions, (err, qrDataUrl) => {
            if (err) {
                reject('Error generating QR code: ' + err);
            } else {
                resolve(qrDataUrl);
            }
        });
    });
}

app.get("/createCertificate/:registration", async (req, res) => {
    try {
        // Connect to the database
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('result');  // Change collection name if needed

        // Fetch student data by registration number
        const certificate = await collection.findOne({ registration: req.params.registration });

        if (!certificate) {
            return res.status(404).send("Certificate not found");
        }

        // Extract student details
        const {
            registration,
            name,
            fathersname,
            mothersname,
            dob,
            rollno,
            erollno,
            IssueSession,
            duration,
            performance,
            certificate: cert,
            Grade,
            IssueDay,
            IssueMonth,
            IssueYear,
            rows,
            photo
        } = certificate;

        // Create the PDF document
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
        });

        const qrData = {
            registration,
            name,
            rollno,
            erollno,
            IssueSession,
            duration,
            performance,
            Grade,
            IssueDay,
            IssueMonth,
            IssueYear
        }; // Customize this data to include in the QR code


        const qrOptions = {
            errorCorrectionLevel: 'H', // High error correction level for better quality
            type: 'image/jpeg', // Set the type to jpeg
            width: 200, // Set QR code size
            margin: 2 // Set margin around the QR code
        };

        // Read and convert the student's photo to base64
        const filename = photo.split('/').pop();
        const filePath = 'uploads/' + filename;

        // Check if the file exists and is a file (not a directory)
        try {
            const stats = fs.lstatSync(filePath); // Get file stats

            if (stats.isFile()) {
                // Read the file and convert it to base64
                const buffer = fs.readFileSync(filePath);
                const base64String = buffer.toString('base64');
                const dataUrl = `data:image/jpeg;base64,${base64String}`;

                const qrDataUrl = await generateQRCode(qrData, qrOptions); // Wait for QR code generation
                console.log('QR Code Data URL:', qrDataUrl);

                // Add the QR code to the PDF
                doc.addImage(qrDataUrl, 'JPEG', 100, 100, 85, 80)

                // Add the image to the document
                doc.addImage(dataUrl, "JPEG", 440, 100, 85, 70);
            } else {
                console.log(`The path ${filePath} is not a file.`);
            }
        } catch (error) {
            console.log(`File not found or error reading the file: ${filePath}`);
            console.error(error);
            // Handle the error appropriately
        }
        // previwes code
        // const filename = photo.split('/').pop();
        // const buffer = fs.readFileSync('uploads/'+filename);
        // const base64String = buffer.toString('base64');
        // const dataUrl = `data:image/jpeg;base64,${base64String}`;

        // doc.addImage(dataUrl, "JPEG", 440, 100, 85, 60);

        // Add text fields to the PDF


        doc.setFontSize(14);
        doc.text(`${registration}`, 70, 80);
        doc.text(`${titleCase(name)}`, 220, 190);
        doc.text(`${titleCase(fathersname)}`, 220, 215);
        doc.text(`${titleCase(mothersname)}`, 220, 240);
        doc.text(`${dob}`, 440, 240);
        doc.text(`${rollno}`, 145, 260);
        doc.text(`${erollno}`, 330, 260);
        doc.text(`${IssueSession}`, 440, 260);
        doc.text(`${duration}`, 220, 290);
        doc.text(`${titleCase(performance)}`, 345, 340);


        doc.setFont("helvetica", "bold");
        doc.text(`${titleCase(cert)}`, 300, 430, null, null, "center");

        // Table Headers
        const tableStartY = 465;
        const pageWidth = doc.internal.pageSize.width;
        const rectangleWidth = 440;
        const x = (pageWidth - rectangleWidth) / 2;
        doc.setFontSize(11);
        doc.setLineWidth(2);
        doc.rect(x, tableStartY, rectangleWidth, 15);
        doc.text("S.NO", 85, tableStartY + 10);
        doc.text("Subject", 120, tableStartY + 10);
        doc.text("Total", 320, tableStartY + 10);
        doc.text("Theory", 355, tableStartY + 10);
        doc.text("Practical", 400, tableStartY + 10);
        doc.text("Obtained", 455, tableStartY + 10);

        // Add Rows
        let totalTheory = 0;
        let totalPractical = 0;
        let totalObtained = 0;
        const maxRows = 6;
        let maxMarks = 0;
        doc.setFont("times", "normal");

        for (let index = 0; index < maxRows; index++) {
            const rowY = tableStartY + 15 + index * 15;

            // Draw border for each row
            doc.rect(x, rowY, rectangleWidth, 15);

            if (rows[index] !== undefined) {
                doc.text(`${index + 1}`, 85, rowY + 10);
                doc.text(`${titleCase(rows[index].subject) || ""}`, 120, rowY + 10);
                doc.text(`100`, 320, rowY + 10);
                doc.text(`${rows[index].theory || ""}`, 355, rowY + 10);
                doc.text(`${rows[index].practical || ""}`, 400, rowY + 10);
                doc.text(`${rows[index].obtained || ""}`, 455, rowY + 10);

                maxMarks += 100;
                totalTheory += rows[index].theory ? parseInt(rows[index].theory, 10) : 0;
                totalPractical += rows[index].practical ? parseInt(rows[index].practical, 10) : 0;
                totalObtained += rows[index].obtained ? parseInt(rows[index].obtained, 10) : 0;
            }

            //   doc.text(`${index + 1}`, 85, rowY + 10);
            //   doc.text(`${row.subject}`, 120, rowY + 10);
            //   doc.text(`${row.theory}`, 320, rowY + 10);
            //   doc.text(`${row.practical}`, 400, rowY + 10);
            //   doc.text(`${row.obtained}`, 455, rowY + 10);

            //   totalTheory += parseInt(row.theory, 10);
            //   totalPractical += parseInt(row.practical, 10);
            //   totalObtained += parseInt(row.obtained, 10);
        }

        // Add Total Row
        const totalRowY = tableStartY + 15 + maxRows * 15;
        doc.rect(x, totalRowY, rectangleWidth, 15);
        doc.text("Total", 120, totalRowY + 10);
        doc.text(`${maxMarks}`, 320, totalRowY + 10);
        doc.text(`${totalTheory}`, 355, totalRowY + 10);
        doc.text(`${totalPractical}`, 400, totalRowY + 10);
        doc.text(`${totalObtained}`, 455, totalRowY + 10);

        // Add Issue Details
        doc.setFontSize(16);
        doc.text(`${Grade}`, 240, 610);
        doc.text(`${IssueDay}`, 240, 635);
        doc.text(` ${titleCase(IssueMonth)} ${IssueYear}`, 355, 635);

        // Save PDF to a file and send it to the user
        const pdfPath = `./uploads/certificate_${registration}.pdf`;
        doc.save(pdfPath);

        // Send the generated PDF to the client
        res.sendFile(path.resolve(pdfPath), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error downloading the file");
            }
            // Remove the generated PDF file after sending it
            fs.unlinkSync(pdfPath);
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    } finally {
        await client.close();
    }
});
// student test record
const studentTestSchema = new mongoose.Schema({
    name: String,
    batchTime: String,
    teacherName: String,
    answer: {
        partA: Object,
        partB: Object,
        partC: Object,
    },
    marks: { type: Number, default: 0 }
});
const StudentTest = mongoose.model('StudentTest', studentTestSchema);
app.post('/studentTest', async (req, res) => {
    try {
        const studentDetails = req.body; // Get the data sent from the frontend

        // Create a new document in the StudentTest collection
        const studentTest = new StudentTest(studentDetails);
        console.log(studentTest)
        // Save the document to the database
        await studentTest.save();

        // Respond with success
        res.status(201).json({ message: 'Test submitted successfully!' });
    } catch (error) {
        console.error('Error saving test data:', error);
        res.status(500).json({ message: 'There was an error submitting the test.' });
    }
});

app.get('/api/studentTests', async (req, res) => {
    try {
        const studentTests = await StudentTest.find();
        res.status(200).json(studentTests);
    } catch (err) {
        console.error('Error fetching student tests:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// API route to get student test details by ID
app.get('/api/studentTest/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const studentTest = await StudentTest.findById(id);
        if (!studentTest) {
            return res.status(404).json({ message: 'Student test not found' });
        }
        res.status(200).json(studentTest);
    } catch (err) {
        console.error('Error fetching student test by ID:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});