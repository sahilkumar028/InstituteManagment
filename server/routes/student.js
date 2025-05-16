const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const ExcelJS = require('exceljs');

// ... existing code ...

// Download students as Excel
router.get('/download-excel', async (req, res) => {
    console.log('\n=== Excel Download Process Started ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Request Headers:', req.headers);
    
    try {
        // Get all students
        console.log('\n1. Database Query:');
        console.log('Executing Student.find()...');
        const students = await Student.find()
            .sort({ regId: -1 });
        
        console.log(`Found ${students.length} students`);
        console.log('Sample student data:', students.length > 0 ? {
            regId: students[0].regId,
            name: students[0].name,
            course: students[0].course
        } : 'No students found');

        if (students.length === 0) {
            console.log('No students found in database');
            return res.status(404).json({ message: 'No students found to export' });
        }

        // Create a new workbook and worksheet
        console.log('\n2. Creating Excel Workbook:');
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Institute Management System';
        workbook.created = new Date();
        console.log('Workbook created with metadata:', {
            creator: workbook.creator,
            created: workbook.created
        });

        const worksheet = workbook.addWorksheet('Students');
        console.log('Worksheet "Students" created');

        // Define columns
        console.log('\n3. Setting up Worksheet Columns:');
        const columns = [
            { header: 'Registration No.', key: 'regId', width: 15 },
            { header: 'Date of Join', key: 'date', width: 15 },
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Father\'s Name', key: 'fatherName', width: 25 },
            { header: 'Mother\'s Name', key: 'motherName', width: 25 },
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
            { header: 'Course Status', key: 'courseStatus', width: 15 }
        ];
        worksheet.columns = columns;
        console.log('Columns defined:', columns.map(col => col.header));

        // Style the header row
        console.log('\n4. Styling Header Row:');
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
        console.log('Header row styled with bold font and gray background');

        // Add student data
        console.log('\n5. Adding Student Data:');
        let successCount = 0;
        let errorCount = 0;

        students.forEach((student, index) => {
            try {
                const rowData = {
                    regId: student.regId || 'N/A',
                    date: student.date ? new Date(student.date).toLocaleDateString() : 'N/A',
                    name: student.name || 'N/A',
                    fatherName: student.fatherName || 'N/A',
                    motherName: student.motherName || 'N/A',
                    dob: student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A',
                    age: student.age || 'N/A',
                    email: student.email || 'N/A',
                    phone: student.phone || 'N/A',
                    address: student.address || 'N/A',
                    course: student.course || 'N/A',
                    fees: student.fees || 'N/A',
                    duration: student.duration || 'N/A',
                    durationOption: student.durationOption || 'N/A',
                    reference: student.reference || 'N/A',
                    courseStatus: student.courseStatus || 'N/A'
                };
                worksheet.addRow(rowData);
                successCount++;
            } catch (rowError) {
                console.error(`Error adding row for student ${index}:`, rowError);
                errorCount++;
            }
        });
        console.log(`Rows added: ${successCount} successful, ${errorCount} failed`);

        // Style the data rows
        console.log('\n6. Styling Data Rows:');
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
                row.alignment = { vertical: 'middle', horizontal: 'left' };
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            }
        });
        console.log('Data rows styled with borders and alignment');

        // Set response headers
        console.log('\n7. Setting Response Headers:');
        const fileName = `students-list-${new Date().toISOString().split('T')[0]}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        console.log('Headers set:', {
            'Content-Type': res.getHeader('Content-Type'),
            'Content-Disposition': res.getHeader('Content-Disposition')
        });

        // Write to response
        console.log('\n8. Writing Excel File to Response:');
        console.log('Starting workbook.xlsx.write()...');
        await workbook.xlsx.write(res);
        console.log('Workbook written successfully');
        res.end();
        console.log('Response ended');

        console.log('\n=== Excel Download Process Completed Successfully ===');
        console.log('Final Statistics:', {
            totalStudents: students.length,
            successfulRows: successCount,
            failedRows: errorCount,
            fileName: fileName
        });
    } catch (error) {
        console.error('\n=== Error in Excel Download Process ===');
        console.error('Error Type:', error.constructor.name);
        console.error('Error Message:', error.message);
        console.error('Stack Trace:', error.stack);
        console.error('Error Details:', {
            name: error.name,
            code: error.code,
            path: error.path,
            syscall: error.syscall
        });
        
        res.status(500).json({ 
            message: 'Error generating Excel file',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router; 