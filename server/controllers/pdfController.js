const { jsPDF } = require("jspdf");
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const multer = require('multer');

// Configure multer for PDF upload
const uploadpdf = multer({ storage: multer.memoryStorage() });

// Split PDF into odd pages
exports.splitOdd = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No PDF file uploaded.' });
        }

        // Load the uploaded PDF from memory
        const pdfBytes = req.file.buffer;
        const originalPdf = await PDFDocument.load(pdfBytes);

        // Create a new PDF document for the odd pages
        const oddPdf = await PDFDocument.create();
        const totalPages = originalPdf.getPageCount();

        // Collect indices of odd-numbered pages
        const oddPageIndices = [];
        for (let i = 0; i < totalPages; i++) {
            if ((i + 1) % 2 === 1) {
                oddPageIndices.push(i);
            }
        }

        // Copy the odd pages into the new PDF
        for (const pageIndex of oddPageIndices) {
            const [copiedPage] = await oddPdf.copyPages(originalPdf, [pageIndex]);
            oddPdf.addPage(copiedPage);
        }

        // Save the resulting PDF to a byte array
        const oddPdfBytes = await oddPdf.save();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="odd_pages.pdf"');

        // Send the PDF directly
        res.send(Buffer.from(oddPdfBytes));

    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ message: 'Error processing PDF', error: error.message });
    }
};

// Split PDF into even pages
exports.splitEven = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No PDF file uploaded.' });
        }

        // Load the uploaded PDF from memory
        const pdfBytes = req.file.buffer;
        const originalPdf = await PDFDocument.load(pdfBytes);

        // Create a new PDF document for even pages
        const evenPdf = await PDFDocument.create();
        const totalPages = originalPdf.getPageCount();

        // Collect even-numbered pages
        let evenPages = [];
        for (let i = 0; i < totalPages; i++) {
            if ((i + 1) % 2 === 0) {
                evenPages.push(i);
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

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="even_pages.pdf"');

        // Send the PDF directly
        res.send(Buffer.from(evenPdfBytes));

    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ message: 'Error processing PDF', error: error.message });
    }
};

// Print PDF with odd and even sides
exports.printPDF = async (req, res) => {
    try {
        const { registration } = req.params;
        const { side } = req.query; // 'odd' or 'even'

        // Create the PDF document
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
            margin: 1
        });

        // Add header
        doc.setFontSize(16);
        doc.text('SAHA INSTITUTE', 300, 50, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Registration No: ' + registration, 300, 70, { align: 'center' });

        // Add content based on side
        if (side === 'odd') {
            // Add odd side content
            doc.setFontSize(12);
            doc.text('Odd Side Content', 50, 100);
            // Add more content for odd side
        } else if (side === 'even') {
            // Add even side content
            doc.setFontSize(12);
            doc.text('Even Side Content', 50, 100);
            // Add more content for even side
        } else {
            return res.status(400).json({ message: 'Invalid side parameter. Use "odd" or "even"' });
        }

        // Save PDF to a file
        const pdfPath = `./uploads/notes_${registration}_${side}.pdf`;
        doc.save(pdfPath);

        // Set headers for PDF viewing
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=notes.pdf');

        // Send the generated PDF to the client
        res.sendFile(path.resolve(pdfPath), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error viewing the file");
            }
            // Remove the generated PDF file after sending it
            fs.unlinkSync(pdfPath);
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// Print both sides
exports.printBothSides = async (req, res) => {
    try {
        const { registration } = req.params;

        // Create the PDF document
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
            margin: 1
        });

        // Add header
        doc.setFontSize(16);
        doc.text('SAHA INSTITUTE', 300, 50, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Registration No: ' + registration, 300, 70, { align: 'center' });

        // Add odd side content
        doc.setFontSize(12);
        doc.text('Odd Side Content', 50, 100);
        // Add more content for odd side

        // Add new page for even side
        doc.addPage();
        doc.setFontSize(16);
        doc.text('SAHA INSTITUTE', 300, 50, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Registration No: ' + registration, 300, 70, { align: 'center' });
        doc.text('Even Side Content', 50, 100);
        // Add more content for even side

        // Save PDF to a file
        const pdfPath = `./uploads/notes_${registration}_both.pdf`;
        doc.save(pdfPath);

        // Set headers for PDF viewing
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=notes.pdf');

        // Send the generated PDF to the client
        res.sendFile(path.resolve(pdfPath), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error viewing the file");
            }
            // Remove the generated PDF file after sending it
            fs.unlinkSync(pdfPath);
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
}; 