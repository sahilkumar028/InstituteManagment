const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const PaymentSlipTemplate = require('../templates/paymentSlipTemplate');

const generatePaymentSlip = async (payment, student) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 10 });
            const fileName = `payment_slip_${payment._id}.pdf`;
            const filePath = path.join(__dirname, '../uploads', fileName);
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Create template instance with payment and student data
            const template = new PaymentSlipTemplate(doc, {
                ...payment.toObject(),
                student: student.toObject()
            });

            // Generate Student Slip
            template.generateSlip('Student Slip', 10);

            // Add dotted line
            template.drawDottedLine(240);

            // Generate Office Slip (commented out for now)
            // template.generateSlip('Office Slip', 260);

            doc.end();

            stream.on('finish', () => resolve(fileName));
            stream.on('error', reject);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    generatePaymentSlip
};
