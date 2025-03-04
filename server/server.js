const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const Student = require('./models/Student');
const Enquiry = require('./models/Enquiry');
const { MongoClient } = require('mongodb');
const ExcelJS = require('exceljs');
const { createCanvas } = require('canvas');
const JsBarcode = require('jsbarcode');
const { PDFDocument } = require('pdf-lib');

async function generateBarcode(registration) {
    const canvas = createCanvas(400, 150); // Increased resolution
    JsBarcode(canvas, registration, {
        format: "CODE128",
        width: 3,       // Increased bar width for better clarity
        height: 80,     // Increased height for better visibility
        displayValue: false,
        margin: 5       // Adds margin to prevent cropping
    });
    return canvas.toDataURL("image/png");
}

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

app.get('/api/students/download', async (req, res) => {
    try {
        const students = await Student.find(); // Fetch all students

        // Create a workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Students');

        // Define columns for the Excel sheet
        worksheet.columns = [
            { header: 'Reg ID', key: 'regId', width: 15 },
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Father Name', key: 'fatherName', width: 25 },
            { header: 'Mother Name', key: 'motherName', width: 25 },
            { header: 'Date of Birth', key: 'dob', width: 15 },
            { header: 'Age', key: 'age', width: 10 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Address', key: 'address', width: 50 },
            { header: 'Course', key: 'course', width: 20 },
            { header: 'Fees', key: 'fees', width: 10 },
            { header: 'Duration', key: 'duration', width: 15 },
            { header: 'Duration Option', key: 'durationOption', width: 20 },
            { header: 'Reference', key: 'reference', width: 20 },
            { header: 'Course Status', key: 'courseStatus', width: 15 },
        ];

        // Add student data as rows
        students.forEach(student => {
            worksheet.addRow({
                regId: student.regId,
                name: student.name,
                fatherName: student.fatherName,
                motherName: student.motherName,
                dob: student.dob.toISOString().split('T')[0],
                age: student.age,
                email: student.email,
                phone: student.phone,
                address: student.address,
                course: student.course,
                fees: student.fees,
                duration: student.duration,
                durationOption: student.durationOption,
                reference: student.reference,
                courseStatus: student.courseStatus,
            });
        });

        // Set headers for download
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');

        // Write workbook to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: 'Error generating Excel file', error });
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

async function insertData(Data) {
    try {
        // Connect to the database
        await formClient.connect();
        const db = formClient.db('institute');
        const collection = db.collection('result');

        console.log("Input Data:", Data);

        // Check if the registration number already exists
        if (Data.registration) {
            const existingData = await collection.findOne({ registration: Data.registration });
            if (existingData) {
                throw new Error(`Data with registration number ${Data.registration} already exists.`);
            }
        } else {
            throw new Error("Registration number is missing in the input data.");
        }

        // Insert the data directly into the collection
        const result = await collection.insertOne(Data);

        console.log("Data inserted successfully:", result.insertedId);
        return result.insertedId; // Return the unique ID of the inserted document
    } catch (error) {
        console.error("Error inserting data:", error.message);
        throw error; // Re-throw the error for the calling function to handle
    } finally {
        // Ensure the database connection is closed
        try {
            await formClient.close();
        } catch (closeError) {
            console.error("Error closing the database connection:", closeError.message);
        }
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
            margin: 1
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

                
                const barcodeDataUrl = await generateBarcode(registration);
                doc.addImage(barcodeDataUrl, 'PNG', 450, 70, 85, 14);

                // Add the QR code to the PDF
                doc.addImage(qrDataUrl, 'JPEG', 70, 100, 85, 80)

                // Add the image to the document
                doc.addImage(dataUrl, "JPEG", 450, 100, 85, 70);
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
        doc.text(`${titleCase(name)}`, 220, 180);
        doc.text(`${titleCase(fathersname)}`, 220, 205);
        doc.text(`${titleCase(mothersname)}`, 220, 230);
        doc.text(`${dob}`, 440, 230);
        doc.text(`${rollno}`, 145, 260);
        doc.text(`${erollno}`, 310, 260);
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

app.get('/student-data/monthly', async (req, res) => {
    try {
        // Aggregate data to count students grouped by month and year
        const monthlyData = await Student.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$date" }, // Extract the month from the 'date' field
                        year: { $year: "$date" }, // Extract the year from the 'date' field
                    },
                    count: { $sum: 1 }, // Count the number of students
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and then by month
            },
        ]);

        // Map the aggregated data to include month names and year
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const result = monthlyData.map(item => ({
            month: months[item._id.month - 1], // Convert month number to name
            year: item._id.year, // Include the year
            count: item.count, // Student count for the month
        }));

        res.status(200).json(result); // Send the result as JSON
    } catch (error) {
        console.error('Error fetching monthly student data:', error);
        res.status(500).json({ message: 'Failed to fetch monthly student data', error });
    }
});

// mcp qr code generator
// app.get("/mcpQr", async (req, res) => {
//     try {
//         const doc = new jsPDF({
//             orientation: "portrait",
//             unit: "pt",
//             format: "a4",
//             margin: 0,
//         });

//         const rows = 9; // Number of rows of QR codes on the page
//         const cols = 7; // Number of columns of QR codes on the page
//         const qrSize = 65; // Size of each QR code (width and height in points)
//         const startX = 10; // Starting X position
//         const startY = 10; // Starting Y position
//         const spacingX = 20; // Horizontal spacing between QR codes
//         const spacingY = 20; // Vertical spacing between QR codes

//         let idCounter = 1; // Counter for generating unique IDs
//         const qrOptions = {
//             errorCorrectionLevel: "H",
//             type: "image/jpeg",
//             margin: 0,
//         };

//         // Generate and add QR codes to the PDF
//         for (let row = 0; row < rows; row++) {
//             for (let col = 0; col < cols; col++) {
//                 const qrData = `MCP280125${String(idCounter).padStart(4, "0")}`;
//                 const qrDataUrl = await QRCode.toDataURL(qrData, qrOptions);

//                 const posX = startX + col * (qrSize + spacingX);
//                 const posY = startY + row * (qrSize + spacingY);

//                 doc.addImage(qrDataUrl, "JPEG", posX, posY, qrSize, qrSize);
                
//                 idCounter++;
//             }
//         }

//         // Save the PDF to a file
//         const pdfPath = "./uploads/multiple_qr_codes.pdf";
//         doc.save(pdfPath);

//         // Send the PDF file to the client
//         res.sendFile(path.resolve(pdfPath), (err) => {
//             if (err) {
//                 console.error(err);
//                 res.status(500).send("Error downloading the file");
//             }

//             // Remove the generated PDF after sending it
//             fs.unlinkSync(pdfPath);
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server Error");
//     }
// });



// Start server

const uploadpdf = multer({ storage: multer.memoryStorage() });

/**
 * POST /split/odd
 * Accepts a PDF upload and returns a PDF containing only odd-numbered pages.
 */
app.post('/split/odd', uploadpdf.single('pdf'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No PDF file uploaded.');
      }
  
      // Load the uploaded PDF from memory
      const pdfBytes = req.file.buffer;
      const originalPdf = await PDFDocument.load(pdfBytes);
  
      // Create a new PDF document for the reversed odd pages
      const reversedOddPdf = await PDFDocument.create();
      const totalPages = originalPdf.getPageCount();
  
      // Collect indices of odd-numbered pages
      const oddPageIndices = [];
      for (let i = 0; i < totalPages; i++) {
        // (i + 1) represents the actual page number
        if ((i + 1) % 2 === 1) {
          oddPageIndices.push(i);
        }
      }
  
      // Reverse the order of odd page indices
    //   oddPageIndices.reverse();/
  
      // Copy the odd pages in reversed order into the new PDF
      for (const pageIndex of oddPageIndices) {
        const [copiedPage] = await reversedOddPdf.copyPages(originalPdf, [pageIndex]);
        reversedOddPdf.addPage(copiedPage);
      }
  
      // Save the resulting PDF to a byte array
      const reversedOddPdfBytes = await reversedOddPdf.save();
  
      // Set response headers to display the PDF inline in the browser
      res.setHeader('Content-Disposition', 'inline; filename="odd_pages_reversed.pdf"');
      res.setHeader('Content-Type', 'application/pdf');
      res.send(Buffer.from(reversedOddPdfBytes));
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing PDF.');
    }
  });
  
/**
 * POST /split/even
 * Accepts a PDF upload and returns a PDF containing only even-numbered pages.
 */
app.post('/split/even', uploadpdf.single('pdf'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No PDF file uploaded.');
      }
  
      // Load the uploaded PDF from memory
      const pdfBytes = req.file.buffer;
      const originalPdf = await PDFDocument.load(pdfBytes);
  
      // Create a new PDF document for even pages
      const evenPdf = await PDFDocument.create();
      const totalPages = originalPdf.getPageCount();
  
      // Collect even-numbered pages first
      let evenPages = [];
      for (let i = 0; i < totalPages; i++) {
        if ((i + 1) % 2 === 0) {
          evenPages.push(i); // Store even page indexes
        }
      }
  
      // Reverse the order before copying pages
      evenPages.reverse();
  
      // Copy and add pages in reversed order
      for (let i of evenPages) {
        const [copiedPage] = await evenPdf.copyPages(originalPdf, [i]);
        evenPdf.addPage(copiedPage);
      }
  
      // Save the resulting PDF to a byte array
      const evenPdfBytes = await evenPdf.save();
  
      // Set response headers to force download
      res.setHeader('Content-Disposition', 'attachment; filename="even_pages_reversed.pdf"');
      res.setHeader('Content-Type', 'application/pdf');
      res.send(Buffer.from(evenPdfBytes));
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing PDF.');
    }
  });

app.get('/run', async (req, res) => {
    res.send("hello")
});
  

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});