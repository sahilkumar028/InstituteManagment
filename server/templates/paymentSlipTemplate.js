const PDFDocument = require('pdfkit');

class PaymentSlipTemplate {
    constructor(doc, data) {
        this.doc = doc;
        this.data = data;
        this.slipWidth = 575;
        this.slipHeight = 230;
        this.xStart = 10;
        this.tableLeft = this.xStart + 10;
        this.tableWidth = this.slipWidth - 20;
        this.rowHeight = 25;
        this.colWidth = this.tableWidth / 4;
    }

    drawHeader(y) {
        this.doc.moveDown();
        this.doc.fontSize(40).text('SAHA INSTITUTE', { align: 'center' });
        this.doc.fontSize(10).text('Sector -3 Ballabgarh, Faridabad, (Haryana)', { align: 'center' });
        this.doc.moveDown();
        this.doc.moveDown();
        return y + 70;
    }

    drawTableRow(col1, col2, col3, col4, y) {
        // Draw row border
        this.doc.rect(this.tableLeft, y, this.tableWidth, this.rowHeight).stroke();
        
        // Draw vertical lines between columns
        for (let i = 1; i < 4; i++) {
            this.doc.moveTo(this.tableLeft + (this.colWidth * i), y)
               .lineTo(this.tableLeft + (this.colWidth * i), y + this.rowHeight)
               .stroke();
        }
        
        // Add content in each column
        this.doc.text(col1, this.tableLeft + 5, y + 5, {
            width: this.colWidth - 10,
            align: 'left'
        });
        
        this.doc.text(col2, this.tableLeft + this.colWidth + 5, y + 5, {
            width: this.colWidth - 10,
            align: 'left'
        });
        
        this.doc.text(col3, this.tableLeft + (this.colWidth * 2) + 5, y + 5, {
            width: this.colWidth - 10,
            align: 'left'
        });
        
        this.doc.text(col4, this.tableLeft + (this.colWidth * 3) + 5, y + 5, {
            width: this.colWidth - 10,
            align: 'left'
        });
        
        return y + this.rowHeight;
    }

    drawFooter(y) {
        this.doc.moveDown(2);
        // this.doc.fontSize(8).text(
        //     ,
        //     { align: 'justify', width: this.tableWidth }
        // );
        this.doc.text(`Fees once paid are non-refundable.\n` +
            `Students must countersign the receipt slip (matching the signature on the admission form) when depositing the fee. ` +
            `Without this countersignature, no certificate will be issued, and the fee will not be recorded in the Saha account.\n` +
            `Cutting or overwriting on forms is not allowed. Only cancellation is permitted.`, this.tableLeft + 5, y + 5, {
            width: this.colWidth - 10,
            align: 'left'
        });
    }
    

    drawDottedLine(y) {
        const dashLength = 5;
        const gapLength = 5;
        const totalLength = dashLength + gapLength;
        const numDashes = Math.floor(500 / totalLength);

        for (let i = 0; i < numDashes; i++) {
            const x = 50 + (i * totalLength);
            this.doc.moveTo(x, y)
               .lineTo(x + dashLength, y)
               .stroke();
        }
    }

    generateSlip(title, yStart) {
        let y = yStart;

        // Draw border
        this.doc.rect(this.xStart, y, this.slipWidth, this.slipHeight).stroke();

        // Draw header
        y = this.drawHeader(y);

        // Draw table rows
        y = this.drawTableRow(
            'Receipt No: ' + this.data.receiptNumber,
            '',
            '',
            'Date: ' + new Date(this.data.paymentDate).toLocaleDateString(),
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

        // Draw footer
        this.drawFooter(y);
    }
}

module.exports = PaymentSlipTemplate; 