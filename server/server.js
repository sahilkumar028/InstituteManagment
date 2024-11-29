const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const Student = require('./models/Student');
const { MongoClient } = require('mongodb');

const { jsPDF } = require("jspdf");
const fs = require('fs');

const client = new MongoClient('mongodb://localhost:27017');
const dbName = 'institute';

// MongoDB URIs
const studentDbUrl = "mongodb://localhost:27017/institute";
const formDbUrl = "mongodb://localhost:27017/form_data";

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
      session,
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

    // Read and convert the student's photo to base64
    const filename = photo.split('/').pop();
    const buffer = fs.readFileSync('uploads/'+filename);
    const base64String = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64String}`;

    doc.addImage(dataUrl, "JPEG", 440, 80, 100, 80);

    // Add text fields to the PDF
    doc.setFontSize(14);
    doc.text(`${registration}`, 40, 70);
    doc.text(`${name}`, 220, 180);
    doc.text(`${fathersname}`, 220, 205);
    doc.text(`${mothersname}`, 220, 230);
    doc.text(`${dob}`, 440, 230);
    doc.text(`${rollno}`, 145, 260);
    doc.text(`${erollno}`, 330, 260);
    doc.text(`${session}`, 440, 260);
    doc.text(`${duration}`, 220, 280);
    doc.text(`${performance}`, 345, 340);

    
    doc.setFont("helvetica", "bold");
    doc.text(`${cert}`, 300,420,null,null,"center");

    // Table Headers
    const tableStartY = 460;
    doc.setFontSize(11);
    doc.setLineWidth(2);
    doc.rect(40, tableStartY, 515, 15);
    doc.text("S.NO", 50, tableStartY + 10);
    doc.text("Subject", 90, tableStartY + 10);
    doc.text("Total", 260, tableStartY + 10);
    doc.text("Theory", 340, tableStartY + 10);
    doc.text("Practical", 420, tableStartY + 10);
    doc.text("Obtained", 500, tableStartY + 10);

    // Add Rows
    let totalTheory = 0;
    let totalPractical = 0;
    let totalObtained = 0;
    const maxRows = 6;
    let maxMarks=0;
    doc.setFont("times", "normal");

    for (let index = 0; index < maxRows; index++) {
      const rowY = tableStartY + 15 + index * 15;

      // Draw border for each row
      doc.rect(40, rowY, 515, 15);

      if(rows[index]!==undefined){
        doc.text(`${index + 1}`, 50, rowY + 10);
        doc.text(`${rows[index].subject || ""}`, 90, rowY + 10);
        doc.text(`100`, 260, rowY + 10);
        doc.text(`${rows[index].theory || ""}`, 340, rowY + 10);
        doc.text(`${rows[index].practical || ""}`, 420, rowY + 10);
        doc.text(`${rows[index].obtained || ""}`, 500, rowY + 10);

        maxMarks += 100;
        totalTheory += rows[index].theory ? parseInt(rows[index].theory, 10) : 0;
        totalPractical += rows[index].practical ? parseInt(rows[index].practical, 10) : 0;
        totalObtained += rows[index].obtained ? parseInt(rows[index].obtained, 10) : 0;
      }

    //   doc.text(`${index + 1}`, 50, rowY + 10);
    //   doc.text(`${row.subject}`, 90, rowY + 10);
    //   doc.text(`${row.theory}`, 340, rowY + 10);
    //   doc.text(`${row.practical}`, 420, rowY + 10);
    //   doc.text(`${row.obtained}`, 500, rowY + 10);

    //   totalTheory += parseInt(row.theory, 10);
    //   totalPractical += parseInt(row.practical, 10);
    //   totalObtained += parseInt(row.obtained, 10);
    }

    // Add Total Row
    const totalRowY = tableStartY + 15 + maxRows * 15;
    doc.rect(40, totalRowY, 515, 15);
    doc.text("Total", 90, totalRowY + 10);
    doc.text(`${maxMarks}`, 260, totalRowY + 10);
    doc.text(`${totalTheory}`, 340, totalRowY + 10);
    doc.text(`${totalPractical}`, 420, totalRowY + 10);
    doc.text(`${totalObtained}`, 500, totalRowY + 10);

    // Add Issue Details
    doc.setFontSize(16);
    doc.text(`${Grade}`, 240, 610);
    doc.text(`${IssueDay} ${IssueMonth}`, 240, 640);
    doc.text(`${IssueYear}`, 380, 640);

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


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

