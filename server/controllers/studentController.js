const Student = require('../models/Student');
const ExcelJS = require('exceljs');
const { createCanvas } = require('canvas');
const JsBarcode = require('jsbarcode');
const { PDFDocument } = require('pdf-lib');
const QRCode = require('qrcode');
const { jsPDF } = require("jspdf");
const fs = require('fs');
const path = require('path');

// Generate barcode
async function generateBarcode(registration) {
    const canvas = createCanvas(400, 150);
    JsBarcode(canvas, registration, {
        format: "CODE128",
        width: 3,
        height: 80,
        displayValue: false,
        margin: 5
    });
    return canvas.toDataURL("image/png");
}

// Helper function to title case
function titleCase(str) {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Create new student
exports.createStudent = async (req, res) => {
    try {
        const { date, name, fatherName, motherName, dob, age, email, phone, address, course, fees, duration, durationOption, reference } = req.body;
        const files = req.files;

        // Get file paths if files were uploaded
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
        res.status(201).json({ 
            message: 'Student added successfully', 
            studentId: savedStudent.regId 
        });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(400).json({ 
            message: 'Failed to create student', 
            error: error.message 
        });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ regId: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve students', error });
    }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve student', error });
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update student', error });
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete student', error });
    }
};

// Complete course
exports.completeCourse = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { status: 'completed' },
            { new: true }
        );
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Failed to complete course', error });
    }
};

// Download students
exports.downloadStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ regId: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Failed to download students', error });
    }
};

// Download students as Excel
exports.downloadStudentsAsExcel = async (req, res) => {
    try {
        const students = await Student.find();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Students');

        worksheet.columns = [
            { header: 'Reg ID', key: 'regId', width: 15 },
            { header: 'Date Of Join', key: 'date', width: 15 },
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

        students.forEach(student => {
            worksheet.addRow({
                regId: student.regId,
                date: student.date ? student.date.toISOString().split('T')[0] : '',
                name: student.name,
                fatherName: student.fatherName,
                motherName: student.motherName,
                dob: student.dob ? student.dob.toISOString().split('T')[0] : '',
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

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: 'Error generating Excel file', error });
    }
};

// Generate certificate
exports.generateCertificate = async (registration) => {
    try {
        const student = await Student.findOne({ regId: registration });
        if (!student) {
            throw new Error('Student not found');
        }

        // Create the PDF document
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
            margin: 1
        });

        const qrData = {
            registration: student.regId,
            name: student.name,
            rollno: student.regId,
            erollno: student.regId,
            IssueSession: new Date().getFullYear(),
            duration: student.duration,
            performance: "Excellent",
            Grade: "A+",
            IssueDay: new Date().getDate(),
            IssueMonth: new Date().toLocaleString('default', { month: 'long' }),
            IssueYear: new Date().getFullYear()
        };

        const qrOptions = {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            width: 200,
            margin: 2
        };

        // Read and convert the student's photo to base64
        const filename = student.photo.split('/').pop();
        const filePath = 'uploads/' + filename;

        try {
            const stats = fs.lstatSync(filePath);

            if (stats.isFile()) {
                const buffer = fs.readFileSync(filePath);
                const base64String = buffer.toString('base64');
                const dataUrl = `data:image/jpeg;base64,${base64String}`;

                const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), qrOptions);
                console.log('QR Code Data URL:', qrDataUrl);

                const barcodeDataUrl = await generateBarcode(student.regId);
                doc.addImage(barcodeDataUrl, 'PNG', 450, 70, 85, 14);

                // Add the QR code to the PDF
                doc.addImage(qrDataUrl, 'JPEG', 70, 100, 85, 80);

                // Add the image to the document
                doc.addImage(dataUrl, "JPEG", 450, 100, 85, 70);
            } else {
                console.log(`The path ${filePath} is not a file.`);
            }
        } catch (error) {
            console.log(`File not found or error reading the file: ${filePath}`);
            console.error(error);
        }

        // Add text fields to the PDF
        doc.setFontSize(14);
        doc.text(`${student.regId}`, 70, 80);
        doc.text(`${student.name}`, 220, 180);
        doc.text(`${student.fatherName}`, 220, 205);
        doc.text(`${student.motherName}`, 220, 230);
        doc.text(`${new Date(student.dob).toLocaleDateString()}`, 440, 230);
        doc.text(`${student.regId}`, 145, 260);
        doc.text(`${student.regId}`, 310, 260);
        doc.text(`${new Date().getFullYear()}`, 440, 260);
        doc.text(`${student.duration}`, 220, 290);
        doc.text(`Excellent`, 345, 340);

        doc.setFont("helvetica", "bold");
        doc.text(`Certificate of Completion`, 300, 430, null, null, "center");

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
            doc.rect(x, rowY, rectangleWidth, 15);
            doc.text(`${index + 1}`, 85, rowY + 10);
            doc.text(`Subject ${index + 1}`, 120, rowY + 10);
            doc.text(`100`, 320, rowY + 10);
            doc.text(`40`, 355, rowY + 10);
            doc.text(`60`, 400, rowY + 10);
            doc.text(`90`, 455, rowY + 10);

            maxMarks += 100;
            totalTheory += 40;
            totalPractical += 60;
            totalObtained += 90;
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
        doc.text(`A+`, 240, 610);
        doc.text(`${new Date().getDate()}`, 240, 635);
        doc.text(`${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`, 355, 635);

        // Save PDF to a file and return the path
        const pdfPath = `./uploads/certificate_${student.regId}.pdf`;
        doc.save(pdfPath);
        return pdfPath;

    } catch (error) {
        console.error(error);
        throw error;
    }
}; 