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
            reference,
            courseStatus: 'Incomplete'
        });

        const savedStudent = await student.save();
        res.status(201).json({ 
            success: true,
            message: 'Student added successfully', 
            studentId: savedStudent.regId
        });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(400).json({ 
            success: false,
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
        const { date, name, fatherName, motherName, dob, age, email, phone, address, course, fees, duration, durationOption, reference } = req.body;
        const files = req.files;

        // First, find the existing student to check if it exists
        const existingStudent = await Student.findById(req.params.id);
        if (!existingStudent) {
            return res.status(404).json({ 
                success: false,
                message: 'Student not found' 
            });
        }

        // Prepare update data
        const updateData = {
            date: new Date(date),
            name,
            fatherName,
            motherName,
            dob: new Date(dob),
            age: parseInt(age),
            email,
            phone,
            address,
            course,
            fees: parseInt(fees),
            duration,
            durationOption,
            reference
        };

        // Handle file uploads if new files are provided
        if (files) {
            if (files['photo']) {
                updateData.photo = files['photo'][0].filename;
            }
            if (files['marksheet']) {
                updateData.marksheet = files['marksheet'][0].filename;
            }
            if (files['aadhaar']) {
                updateData.aadhaar = files['aadhaar'][0].filename;
            }
        }

        // Check for duplicate students (excluding the current student being updated)
        const duplicateStudent = await Student.findOne({
            email,
            phone,
            course,
            name,
            _id: { $ne: req.params.id } // Exclude current student
        });

        if (duplicateStudent) {
            return res.status(400).json({
                success: false,
                message: 'A student with the same email, phone number, course, and name already exists.'
            });
        }

        // Update the student
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: false } // Disable validators to avoid pre-save hook issues
        );
        
        res.json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(400).json({ 
            success: false,
            message: 'Failed to update student', 
            error: error.message 
        });
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
        const { courseStatus } = req.body;
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { courseStatus },
            { new: true, runValidators: true }
        );
        
        if (!student) {
            return res.status(404).json({ 
                success: false,
                message: 'Student not found' 
            });
        }
        
        res.json({
            success: true,
            data: student,
            message: `Course status updated to ${courseStatus}`
        });
    } catch (error) {
        console.error('Error updating course status:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update course status',
            error: error.message 
        });
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

