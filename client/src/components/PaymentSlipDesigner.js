import React, { useState } from 'react';
import './PaymentSlipDesigner.css';

const PaymentSlipDesigner = () => {
    const [design, setDesign] = useState({
        header: {
            instituteName: 'SAHA INSTITUTE',
            address: 'Sector -3 Ballabgarh, Faridabad, (Haryana)',
            fontSize: 40,
            addressFontSize: 10
        },
        table: {
            width: 575,
            height: 230,
            rowHeight: 25,
            columns: 4,
            borderColor: '#000',
            textColor: '#000',
            fontSize: 12
        },
        footer: {
            text: `Fees once paid are non-refundable.
Students must countersign the receipt slip (matching the signature on the admission form) when depositing the fee.
Without this countersignature, no certificate will be issued, and the fee will not be recorded in the Saha account.
Cutting or overwriting on forms is not allowed. Only cancellation is permitted.`,
            fontSize: 8,
            color: '#000'
        }
    });

    const [previewData, setPreviewData] = useState({
        receiptNumber: 'SIMT24031001',
        date: new Date().toLocaleDateString(),
        studentName: 'John Doe',
        fatherName: 'James Doe',
        regId: 'REG001',
        course: 'Computer Science',
        session: '2024-2025',
        timing: 'Morning',
        amount: 5000,
        totalAmount: 10000
    });

    const handleDesignChange = (section, field, value) => {
        setDesign(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handlePreviewDataChange = (field, value) => {
        setPreviewData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const generateCode = () => {
        const code = `class PaymentSlipTemplate {
    constructor(doc, data) {
        this.doc = doc;
        this.data = data;
        this.slipWidth = ${design.table.width};
        this.slipHeight = ${design.table.height};
        this.xStart = 10;
        this.tableLeft = this.xStart + 10;
        this.tableWidth = this.slipWidth - 20;
        this.rowHeight = ${design.table.rowHeight};
        this.colWidth = this.tableWidth / ${design.table.columns};
    }

    drawHeader(y) {
        this.doc.moveDown();
        this.doc.fontSize(${design.header.fontSize}).text('${design.header.instituteName}', { align: 'center' });
        this.doc.fontSize(${design.header.addressFontSize}).text('${design.header.address}', { align: 'center' });
        this.doc.moveDown();
        this.doc.moveDown();
        return y + 70;
    }

    drawTableRow(col1, col2, col3, col4, y) {
        // Draw row border
        this.doc.rect(this.tableLeft, y, this.tableWidth, this.rowHeight).stroke();
        
        // Draw vertical lines between columns
        for (let i = 1; i < ${design.table.columns}; i++) {
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
        this.doc.fontSize(${design.footer.fontSize}).text(
            \`${design.footer.text}\`,
            { align: 'justify', width: this.tableWidth }
        );
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
            \`\${new Date(this.data.paymentDate).getFullYear()}-\${new Date(this.data.paymentDate).getFullYear() + 1}\`,
            'Timing:',
            this.data.student.timing,
            y
        );
        y = this.drawTableRow(
            'Received Amount:',
            \`₹\${this.data.amount} Only\`,
            'Balance Amount:',
            \`₹\${this.data.student.totalAmount - this.data.amount}\`,
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
}`;
        return code;
    };

    return (
        <div className="payment-slip-designer">
            <div className="design-controls">
                <h2>Design Controls</h2>
                <div className="control-section">
                    <h3>Header</h3>
                    <div className="control-group">
                        <label>Institute Name:</label>
                        <input
                            type="text"
                            value={design.header.instituteName}
                            onChange={(e) => handleDesignChange('header', 'instituteName', e.target.value)}
                        />
                    </div>
                    <div className="control-group">
                        <label>Address:</label>
                        <input
                            type="text"
                            value={design.header.address}
                            onChange={(e) => handleDesignChange('header', 'address', e.target.value)}
                        />
                    </div>
                    <div className="control-group">
                        <label>Font Size:</label>
                        <input
                            type="number"
                            value={design.header.fontSize}
                            onChange={(e) => handleDesignChange('header', 'fontSize', parseInt(e.target.value))}
                        />
                    </div>
                </div>

                <div className="control-section">
                    <h3>Table</h3>
                    <div className="control-group">
                        <label>Width:</label>
                        <input
                            type="number"
                            value={design.table.width}
                            onChange={(e) => handleDesignChange('table', 'width', parseInt(e.target.value))}
                        />
                    </div>
                    <div className="control-group">
                        <label>Height:</label>
                        <input
                            type="number"
                            value={design.table.height}
                            onChange={(e) => handleDesignChange('table', 'height', parseInt(e.target.value))}
                        />
                    </div>
                    <div className="control-group">
                        <label>Row Height:</label>
                        <input
                            type="number"
                            value={design.table.rowHeight}
                            onChange={(e) => handleDesignChange('table', 'rowHeight', parseInt(e.target.value))}
                        />
                    </div>
                </div>

                <div className="control-section">
                    <h3>Footer</h3>
                    <div className="control-group">
                        <label>Text:</label>
                        <textarea
                            value={design.footer.text}
                            onChange={(e) => handleDesignChange('footer', 'text', e.target.value)}
                            rows={4}
                        />
                    </div>
                    <div className="control-group">
                        <label>Font Size:</label>
                        <input
                            type="number"
                            value={design.footer.fontSize}
                            onChange={(e) => handleDesignChange('footer', 'fontSize', parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="preview-section">
                <h2>Preview</h2>
                <div className="preview-controls">
                    <h3>Preview Data</h3>
                    <div className="control-group">
                        <label>Receipt Number:</label>
                        <input
                            type="text"
                            value={previewData.receiptNumber}
                            onChange={(e) => handlePreviewDataChange('receiptNumber', e.target.value)}
                        />
                    </div>
                    <div className="control-group">
                        <label>Student Name:</label>
                        <input
                            type="text"
                            value={previewData.studentName}
                            onChange={(e) => handlePreviewDataChange('studentName', e.target.value)}
                        />
                    </div>
                    {/* Add more preview data controls as needed */}
                </div>

                <div className="preview-slip">
                    <div className="slip-container" style={{
                        width: design.table.width,
                        height: design.table.height,
                        border: '1px solid #000',
                        padding: '10px',
                        margin: '20px auto'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: design.header.fontSize }}>{design.header.instituteName}</h1>
                            <p style={{ fontSize: design.header.addressFontSize }}>{design.header.address}</p>
                        </div>
                        <div className="slip-table">
                            <div className="slip-row">
                                <div className="slip-cell">Receipt No: {previewData.receiptNumber}</div>
                                <div className="slip-cell"></div>
                                <div className="slip-cell"></div>
                                <div className="slip-cell">Date: {previewData.date}</div>
                            </div>
                            <div className="slip-row">
                                <div className="slip-cell">Student Name:</div>
                                <div className="slip-cell">{previewData.studentName}</div>
                                <div className="slip-cell">Father Name:</div>
                                <div className="slip-cell">{previewData.fatherName}</div>
                            </div>
                            {/* Add more rows as needed */}
                        </div>
                        <div className="slip-footer" style={{ fontSize: design.footer.fontSize }}>
                            {design.footer.text.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="code-section">
                <h2>Generated Code</h2>
                <pre>
                    <code>{generateCode()}</code>
                </pre>
                <button onClick={() => navigator.clipboard.writeText(generateCode())}>
                    Copy Code
                </button>
            </div>
        </div>
    );
};

export default PaymentSlipDesigner; 