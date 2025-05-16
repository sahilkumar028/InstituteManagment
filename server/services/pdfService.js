const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const PaymentSlipTemplate = require('../templates/paymentSlipTemplate');

const generatePaymentSlip = async (payment, student) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'A4', 
                margin: 10,
                info: {
                    Title: 'Fee Receipt',
                    Author: 'SAHA INSTITUTE',
                    Subject: 'Payment Receipt',
                    Keywords: 'fee, receipt, payment',
                    CreationDate: new Date()
                }
            });

            const fileName = `payment_slip_${payment._id}.pdf`;
            const filePath = path.join(__dirname, '../uploads', fileName);
            const stream = fs.createWriteStream(filePath);

            // Add error handling for the stream
            stream.on('error', (err) => {
                console.error('Error writing to file:', err);
                reject(err);
            });

            doc.pipe(stream);

            // Create template instance with payment and student data
            const template = new PaymentSlipTemplate(doc, {
                ...payment.toObject(),
                student: student.toObject()
            });

            // Generate Student Slip
            template.generateSlip('Student Slip', 10)
                .then(() => {
                    doc.end();
                })
                .catch((error) => {
                    console.error('Error generating slip:', error);
                    reject(error);
                });

            stream.on('finish', () => resolve(fileName));
        } catch (error) {
            console.error('Error in generatePaymentSlip:', error);
            reject(error);
        }
    });
};

module.exports = {
    generatePaymentSlip
};
