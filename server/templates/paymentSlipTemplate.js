const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

class PaymentSlipTemplate {
    constructor(doc, data) {
        this.doc = doc;
        this.data = data;
        this.slipWidth = 575;
        this.slipHeight = 280; // Increased height for more details
        this.xStart = 10;
        this.tableLeft = this.xStart + 10;
        this.tableWidth = this.slipWidth - 20;
        this.rowHeight = 25;
        this.colWidth = this.tableWidth / 4;
    }

    async drawHeader(y) {
        this.doc.moveDown();
        this.doc.fontSize(40).text('SAHA INSTITUTE', { align: 'center' });
        this.doc.fontSize(10).text('Sector -3 Ballabgarh, Faridabad, (Haryana)', { align: 'center' });
        this.doc.fontSize(12).text('Fee Receipt', { align: 'center' });
        this.doc.moveDown();
        return y + 80;
    }

    drawTableRow(label1, value1, label2, value2, y) {
        this.doc.fontSize(10);
        
        // Draw row border
        this.doc.rect(this.tableLeft, y, this.tableWidth, this.rowHeight).stroke();
        
        // Draw vertical lines
        this.doc.moveTo(this.tableLeft + this.colWidth, y)
            .lineTo(this.tableLeft + this.colWidth, y + this.rowHeight)
            .stroke();
        this.doc.moveTo(this.tableLeft + this.colWidth * 2, y)
            .lineTo(this.tableLeft + this.colWidth * 2, y + this.rowHeight)
            .stroke();
        this.doc.moveTo(this.tableLeft + this.colWidth * 3, y)
            .lineTo(this.tableLeft + this.colWidth * 3, y + this.rowHeight)
            .stroke();

        // Add content
        this.doc.text(label1, this.tableLeft + 5, y + 5, { width: this.colWidth - 10 });
        this.doc.text(value1, this.tableLeft + this.colWidth + 5, y + 5, { width: this.colWidth - 10 });
        this.doc.text(label2, this.tableLeft + this.colWidth * 2 + 5, y + 5, { width: this.colWidth - 10 });
        this.doc.text(value2, this.tableLeft + this.colWidth * 3 + 5, y + 5, { width: this.colWidth - 10 });

        return y + this.rowHeight;
    }

    async drawQRCode(y) {
        const qrData = {
            receiptNo: this.data.receiptNumber,
            studentId: this.data.student.regId,
            amount: this.data.amount,
            date: new Date(this.data.paymentDate).toISOString()
        };

        try {
            const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData));
            this.doc.image(qrCodeDataUrl, this.tableLeft + this.tableWidth - 100, y, { width: 80 });
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    }

    drawFooter(y) {
        this.doc.moveDown(2);
        this.doc.fontSize(8).text(
            'Fees once paid are non-refundable.\n' +
            'Students must countersign the receipt slip (matching the signature on the admission form) when depositing the fee.\n' +
            'Without this countersignature, no certificate will be issued, and the fee will not be recorded in the Saha account.\n' +
            'Cutting or overwriting on forms is not allowed. Only cancellation is permitted.',
            { align: 'justify', width: this.tableWidth }
        );
    }

    async generateSlip(title, yStart) {
        let y = yStart;

        // Draw border
        this.doc.rect(this.xStart, y, this.slipWidth, this.slipHeight).stroke();

        // Draw header
        y = await this.drawHeader(y);

        // Draw table rows
        y = this.drawTableRow(
            'Receipt No:',
            this.data.receiptNumber,
            'Date:',
            new Date(this.data.paymentDate).toLocaleDateString(),
            y
        );
        y = this.drawTableRow(
            'Student Name:',
            this.data.student.name,
            'Father Name:',
            this.data.fatherName,
            y
        );
        y = this.drawTableRow(
            'Registration No:',
            this.data.student.regId,
            'Course:',
            this.data.student.course,
            y
        );
        y = this.drawTableRow(
            'Session:',
            `${new Date(this.data.paymentDate).getFullYear()}-${new Date(this.data.paymentDate).getFullYear() + 1}`,
            'Timing:',
            this.data.student.timing,
            y
        );
        y = this.drawTableRow(
            'Payment Method:',
            this.data.paymentMethod,
            'Status:',
            this.data.status,
            y
        );
        y = this.drawTableRow(
            'Received Amount:',
            `₹${this.data.amount} Only`,
            'Balance Amount:',
            `₹${this.data.student.totalAmount - this.data.amount}`,
            y
        );
        y = this.drawTableRow(
            'Student Signature:',
            '',
            'Authorized Signature:',
            '',
            y
        );

        // Draw QR Code
        await this.drawQRCode(y - 100);

        // Draw footer
        this.drawFooter(y);
    }
}

module.exports = PaymentSlipTemplate; 