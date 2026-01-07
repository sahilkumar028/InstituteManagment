const Result = require('../models/resultSchema');
const Student = require('../models/Student');
const { jsPDF } = require("jspdf");
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const JsBarcode = require('jsbarcode');

// Generate QR code
async function generateQRCode(data, options) {
    try {
        return await QRCode.toDataURL(JSON.stringify(data), options);
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}

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

// Get all issued certificates
exports.getAllIssuedCertificates = async (req, res) => {
    try {
        const certificates = await Result.find()
            .sort({ registration: -1 });
        res.json(certificates);
    } catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ message: 'Failed to retrieve certificates', error: error.message });
    }
};

// Get certificate by ID
exports.getCertificateById = async (req, res) => {
    try {
        const certificate = await Result.findById(req.params.id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.json(certificate);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve certificate', error });
    }
};

// Issue new certificate
exports.issueCertificate = async (req, res) => {
    try {
        // Support both :erollno and :enrollno as route params
        const enrollParam = req.params.erollno || req.params.enrollno;
        const certificate = await Result.findOne({ erollno: enrollParam });
        console.log(certificate);
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

        const qrData = 'Registraion No :'+registration+' | Name : '+name+' | performance : '+ performance +' | Course : '+cert;

        const qrOptions = {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            width: 200,
            margin: 2
        };

        // Create watermark canvas
        const watermarkCanvas = createCanvas(400, 400);
        const ctx = watermarkCanvas.getContext('2d');
        ctx.fillStyle = 'rgba(200, 200, 200, 0.1)';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SAHA INSTITUTE', 200, 200);
        const watermarkDataUrl = watermarkCanvas.toDataURL('image/png');

        // Try to read student's photo, if not found use watermark
        let photoDataUrl;
        try {
            const filename = photo.split('/').pop();
            const filePath = 'uploads/' + filename;
            console.log('Attempting to load photo from:', filePath);
            
            const stats = fs.lstatSync(filePath);

            if (stats.isFile()) {
                console.log('Photo file found, loading...');
                const buffer = fs.readFileSync(filePath);
                const base64String = buffer.toString('base64');
                photoDataUrl = `data:image/jpeg;base64,${base64String}`;
                console.log('Student photo loaded successfully');
            } else {
                console.log('Photo file not found, using watermark');
                photoDataUrl = watermarkDataUrl;
            }
        } catch (error) {
            console.log('Error loading student photo:', error.message);
            console.log('Using watermark instead of student photo');
            photoDataUrl = watermarkDataUrl;
        }

        // Generate QR code and barcode
        const qrDataUrl = await generateQRCode(qrData, qrOptions);
        const barcodeDataUrl = await generateBarcode(registration);

        // Add images to PDF
        doc.addImage(barcodeDataUrl, 'PNG', 450, 70, 85, 14);
        doc.addImage(qrDataUrl, 'JPEG', 80, 100, 85, 80);
        doc.addImage(photoDataUrl, "JPEG", 450, 100, 85, 70);

        // Add text fields
        doc.setFontSize(14);
        doc.text(`${registration}`, 80, 80);
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
        // doc.text(`${titleCase(cert)}`, 300, 430, null, null, "center");
        doc.text(`${cert}`, 300, 430, null, null, "center");

        // Table Headers
        const tableStartY = 465;
        const pageWidth = doc.internal.pageSize.width;
        const rectangleWidth = 440;
        const x = ((pageWidth - rectangleWidth) / 2) + 10;
        doc.setFontSize(11);
        doc.setLineWidth(2);
        doc.rect(x, tableStartY, rectangleWidth, 15);
        doc.text("S.NO", 95, tableStartY + 10);
        doc.text("Subject", 130, tableStartY + 10);
        doc.text("Total", 330, tableStartY + 10);
        doc.text("Theory", 365, tableStartY + 10);
        doc.text("Practical", 410, tableStartY + 10);
        doc.text("Obtained", 465, tableStartY + 10);

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

            if (rows[index] !== undefined) {
                doc.text(`${index + 1}`, 95, rowY + 10);
                doc.text(`${titleCase(rows[index].subject) || ""}`, 130, rowY + 10);
                doc.text(`100`, 330, rowY + 10);
                doc.text(`${rows[index].theory || ""}`, 365, rowY + 10);
                doc.text(`${rows[index].practical || ""}`, 410, rowY + 10);
                doc.text(`${rows[index].obtained || ""}`, 465, rowY + 10);

                maxMarks += 100;
                totalTheory += rows[index].theory ? parseInt(rows[index].theory, 10) : 0;
                totalPractical += rows[index].practical ? parseInt(rows[index].practical, 10) : 0;
                totalObtained += rows[index].obtained ? parseInt(rows[index].obtained, 10) : 0;
            }
        }

        // Add Total Row
        const totalRowY = tableStartY + 15 + maxRows * 15;
        doc.rect(x, totalRowY, rectangleWidth, 15);
        doc.text("Total", 130, totalRowY + 10);
        doc.text(`${maxMarks}`, 320, totalRowY + 10);
        doc.text(`${totalTheory}`, 365, totalRowY + 10);
        doc.text(`${totalPractical}`, 410, totalRowY + 10);
        doc.text(`${totalObtained}`, 465, totalRowY + 10);

        // Add Issue Details
        doc.setFontSize(16);
        doc.text(`${Grade}`, 240, 610);
        doc.text(`${IssueDay}`, 240, 635);
        doc.text(` ${titleCase(IssueMonth)} ${IssueYear}`, 355, 635);

        // Save PDF to a file and send it to the user
        const pdfPath = `./uploads/certificate_${registration}.pdf`;
        doc.save(pdfPath);

        // Set headers for PDF viewing
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=certificate.pdf');

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

// Delete certificate
exports.deleteCertificate = async (req, res) => {
    try {
        const certificate = await Result.findByIdAndDelete(req.params.id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.status(200).json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete certificate', error });
    }
};
