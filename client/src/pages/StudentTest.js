import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function StudentTest() {
  const [studentDetails, setStudentDetails] = useState({
    name: "",
    batchTime: "",
    teacherName: "",
    answer: "",
    gatewayShortcut: '',
    voucherType: '',
    dayBookShortcut: '',
    altCAction: '',
    receivablesReport: '',
    gstFeature: '',
    companyFeaturesShortcut: '',
    contraVoucherPurpose: '',
    profitLossReport: '',
    accountingMastersOption: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails({ ...studentDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Test Submitted:", studentDetails);
    alert("Test Submitted Successfully!");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Student Test</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Enter Your Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={studentDetails.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Batch Time:</label>
          <input
            type="text"
            className="form-control"
            name="batchTime"
            value={studentDetails.batchTime}
            onChange={handleChange}
            placeholder="e.g., 10:00 AM - 11:30 AM"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teacher Name Conducting the Test:</label>
          <input
            type="text"
            className="form-control"
            name="teacherName"
            value={studentDetails.teacherName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="text-center mb-4">
      <h5>Total Marks: 70</h5>
    </div>
        <div className="mb-4">
        <h4>Part A: Objective Questions MCQs (1 * 10 = 10 Marks)</h4></div>

        {/* Multiple Choice Questions (MCQs) */}
        <div className="mb-4">
          <h5>1. What is the default Gateway of Tally shortcut key?</h5>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="gatewayShortcut"
              value="F11"
              checked={studentDetails.gatewayShortcut === 'F11'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) F11</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="gatewayShortcut"
              value="F12"
              checked={studentDetails.gatewayShortcut === 'F12'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) F12</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="gatewayShortcut"
              value="Alt + F3"
              checked={studentDetails.gatewayShortcut === 'Alt + F3'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Alt + F3</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="gatewayShortcut"
              value="Alt + F1"
              checked={studentDetails.gatewayShortcut === 'Alt + F1'}
              onChange={handleChange}
            />
            <label className="form-check-label">d) Alt + F1</label>
          </div>
        </div>

        <div className="mb-4">
          <h5>2. Which voucher type is used to record credit sales?</h5>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="voucherType"
              value="Purchase Voucher"
              checked={studentDetails.voucherType === 'Purchase Voucher'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Purchase Voucher</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="voucherType"
              value="Sales Voucher"
              checked={studentDetails.voucherType === 'Sales Voucher'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Sales Voucher</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="voucherType"
              value="Payment Voucher"
              checked={studentDetails.voucherType === 'Payment Voucher'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Payment Voucher</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="voucherType"
              value="Receipt Voucher"
              checked={studentDetails.voucherType === 'Receipt Voucher'}
              onChange={handleChange}
            />
            <label className="form-check-label">d) Receipt Voucher</label>
          </div>
        </div>

        <div className="mb-4">
          <h5>3. What is the shortcut key to open the Day Book in Tally ERP.9?</h5>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="dayBookShortcut"
              value="Double Click on D"
              checked={studentDetails.dayBookShortcut === 'Double Click on D'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Double Click on D</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="dayBookShortcut"
              value="Ctrl + F4"
              checked={studentDetails.dayBookShortcut === 'Ctrl + F4'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Ctrl + F4</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="dayBookShortcut"
              value="D (while in Gateway of Tally)"
              checked={studentDetails.dayBookShortcut === 'D (while in Gateway of Tally)'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) D (while in Gateway of Tally)</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="dayBookShortcut"
              value="Alt + F5"
              checked={studentDetails.dayBookShortcut === 'Alt + F5'}
              onChange={handleChange}
            />
            <label className="form-check-label">d) Alt + F5</label>
          </div>
        </div>

        <div className="mb-4">
          <h5>4. What does the shortcut key Alt + C do in Tally ERP.9?</h5>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="altCAction"
              value="Creates a new company"
              checked={studentDetails.altCAction === 'Creates a new company'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Creates a new company</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="altCAction"
              value="Opens the Company menu"
              checked={studentDetails.altCAction === 'Opens the Company menu'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Opens the Company menu</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="altCAction"
              value="Creates a master (e.g., Ledger or Stock Item)"
              checked={studentDetails.altCAction === 'Creates a master (e.g., Ledger or Stock Item)'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Creates a master (e.g., Ledger or Stock Item)</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="altCAction"
              value="Copies a transaction"
              checked={studentDetails.altCAction === 'Copies a transaction'}
              onChange={handleChange}
            />
            <label className="form-check-label">d) Copies a transaction</label>
          </div>
        </div>

        <div className="mb-4">
          <h5>5. Which report provides details about receivables and payables?</h5>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="receivablesReport"
              value="Stock Summary"
              checked={studentDetails.receivablesReport === 'Stock Summary'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Stock Summary</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="receivablesReport"
              value="Profit and Loss Account"
              checked={studentDetails.receivablesReport === 'Profit and Loss Account'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Profit and Loss Account</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="receivablesReport"
              value="Balance Sheet"
              checked={studentDetails.receivablesReport === 'Balance Sheet'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Balance Sheet</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="receivablesReport"
              value="Outstanding Report"
              checked={studentDetails.receivablesReport === 'Outstanding Report'}
              onChange={handleChange}
            />
            <label className="form-check-label">d) Outstanding Report</label>
          </div>
        </div>

        <div className="mb-4">
          <h5>6. Which feature must be enabled to use GST in Tally ERP.9?</h5>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="gstFeature"
              value="Inventory Features"
              checked={studentDetails.gstFeature === 'Inventory Features'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Inventory Features</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="gstFeature"
              value="Statutory & Taxation"
              checked={studentDetails.gstFeature === 'Statutory & Taxation'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Statutory & Taxation</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="gstFeature"
              value="Accounting Features"
              checked={studentDetails.gstFeature === 'Accounting Features'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Accounting Features</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="gstFeature"
              value="Payroll Features"
              checked={studentDetails.gstFeature === 'Payroll Features'}
              onChange={handleChange}
            />
            <label className="form-check-label">d) Payroll Features</label>
          </div>
        </div>

        <div className="mb-4">
          <h5>7. Which shortcut key is used to open the Company Features screen?</h5>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="companyFeaturesShortcut"
              value="F11"
              checked={studentDetails.companyFeaturesShortcut === 'F11'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) F11</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="companyFeaturesShortcut"
              value="F12"
              checked={studentDetails.companyFeaturesShortcut === 'F12'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) F12</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="companyFeaturesShortcut"
              value="Alt + F1"
              checked={studentDetails.companyFeaturesShortcut === 'Alt + F1'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Alt + F1</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="companyFeaturesShortcut"
              value="Ctrl + A"
              checked={studentDetails.companyFeaturesShortcut === 'Ctrl + A'}
              onChange={handleChange}
            />
            <label className="form-check-label">d) Ctrl + A</label>
          </div>
        </div>

        <div className="mb-4">
          <h5>8. What is the purpose of the Contra Voucher?</h5>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="contraVoucherPurpose"
              value="To record cash or bank transactions within the business"
              checked={studentDetails.contraVoucherPurpose === 'To record cash or bank transactions within the business'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) To record cash or bank transactions within the business</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="contraVoucherPurpose"
              value="To record purchases on credit"
              checked={studentDetails.contraVoucherPurpose === 'To record purchases on credit'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) To record purchases on credit</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="contraVoucherPurpose"
              value="To record sales on credit"
              checked={studentDetails.contraVoucherPurpose === 'To record sales on credit'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) To record sales on credit</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="contraVoucherPurpose"
              value="To record GST payments"
              checked={studentDetails.contraVoucherPurpose === 'To record GST payments'}
              onChange={handleChange}
            />
            <label className="form-check-label">d) To record GST payments</label>
          </div>
        </div>

        <div className="mb-4">
          <h5>9. Which report in Tally shows the profit or loss of the company?</h5>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="profitLossReport"
              value="Balance Sheet"
              checked={studentDetails.profitLossReport === 'Balance Sheet'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Balance Sheet</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="profitLossReport"
              value="Stock Summary"
              checked={studentDetails.profitLossReport === 'Stock Summary'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Stock Summary</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="profitLossReport"
              value="Profit & Loss Account"
              checked={studentDetails.profitLossReport === 'Profit & Loss Account'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Profit & Loss Account</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="profitLossReport"
              value="Daybook"
              checked={studentDetails.profitLossReport === 'Daybook'}
              onChange={handleChange}
            />
            <label className="form-check-label">d) Daybook</label>
          </div>
        </div>

        <div className="mb-4">
          <h5>10. Which option in Tally is used to view all accounting and inventory masters?</h5>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="accountingMastersOption"
              value="Display Menu"
              checked={studentDetails.accountingMastersOption === 'Display Menu'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Display Menu</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="accountingMastersOption"
              value="Gateway of Tally > Accounts Info"
              checked={studentDetails.accountingMastersOption === 'Gateway of Tally > Accounts Info'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Gateway of Tally > Accounts Info</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="accountingMastersOption"
              value="Chart of Accounts"
              checked={studentDetails.accountingMastersOption === 'Chart of Accounts'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Chart of Accounts</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="accountingMastersOption"
              value="Statutory Features"
              checked={studentDetails.accountingMastersOption === 'Statutory Features'}
              onChange={handleChange}
            />
            <label className="form-check-label">d) Statutory Features</label>
          </div>
        </div>
        <div className="mb-4">
  <h4>Part B: Practical Questions (10 x 2 = 20 Marks)</h4>

  {/* Company Creation */}
  <div className="mb-4">
    <h5>1. Company Creation</h5>
    <p>Create a company in Tally ERP.9 with the following details:</p>
    <ul>
      <li>Company Name: Bright Star Traders</li>
      <li>Address: 123 Market Street, Delhi</li>
      <li>Financial Year: 1st April 2023 to 31st March 2024</li>
      <li>Enable GST and set the GSTIN as 07AAAAA0000A1Z5</li>
    </ul>
    <textarea
      className="form-control"
      name="companyCreation"
      value={studentDetails.companyCreation}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Ledger Creation */}
  <div className="mb-4">
    <h5>2. Ledger Creation</h5>
    <p>Create the following ledgers under the appropriate groups:</p>
    <ul>
      <li>Cash (Cash-in-Hand)</li>
      <li>Sales (Sales Account)</li>
      <li>Purchase (Purchase Account)</li>
      <li>ABC Bank (Bank Account)</li>
    </ul>
    <textarea
      className="form-control"
      name="ledgerCreation"
      value={studentDetails.ledgerCreation}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Voucher Entry - Sales */}
  <div className="mb-4">
    <h5>3. Voucher Entry - Sales</h5>
    <p>Record the following transaction in a Sales Voucher:</p>
    <ul>
      <li>On 15th December 2024, sold goods worth ₹25,000 to M/s Reliable Enterprises on credit.</li>
    </ul>
    <textarea
      className="form-control"
      name="voucherEntrySales"
      value={studentDetails.voucherEntrySales}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Voucher Entry - Purchase */}
  <div className="mb-4">
    <h5>4. Voucher Entry - Purchase</h5>
    <p>Record the following transaction in a Purchase Voucher:</p>
    <ul>
      <li>On 18th December 2024, purchased raw materials worth ₹40,000 from XYZ Suppliers, paid through bank transfer.</li>
    </ul>
    <textarea
      className="form-control"
      name="voucherEntryPurchase"
      value={studentDetails.voucherEntryPurchase}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* GST Configuration and Transactions */}
  <div className="mb-4">
    <h5>5. GST Configuration and Transactions</h5>
    <p>Configure GST in Tally ERP.9 and record the following GST-inclusive sales transaction:</p>
    <ul>
      <li>On 20th December 2024, sold goods worth ₹1,00,000 to a customer. GST @18%.</li>
    </ul>
    <textarea
      className="form-control"
      name="gstTransaction"
      value={studentDetails.gstTransaction}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Inventory Management */}
  <div className="mb-4">
    <h5>6. Inventory Management</h5>
    <p>Create stock items and record a purchase transaction for the following:</p>
    <ul>
      <li>Stock Item: Mobile Phones</li>
      <li>Unit of Measure: Pieces</li>
      <li>Quantity: 20</li>
      <li>Rate per piece: ₹15,000</li>
      <li>Supplier: TechWorld Pvt. Ltd.</li>
    </ul>
    <textarea
      className="form-control"
      name="inventoryManagement"
      value={studentDetails.inventoryManagement}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Bank Reconciliation */}
  <div className="mb-4">
    <h5>7. Bank Reconciliation</h5>
    <p>Record the following transactions in a bank ledger and reconcile them:</p>
    <ul>
      <li>On 5th December 2024, issued a cheque of ₹30,000 to a supplier.</li>
      <li>On 10th December 2024, received a cheque of ₹50,000 from a customer.</li>
    </ul>
    <textarea
      className="form-control"
      name="bankReconciliation"
      value={studentDetails.bankReconciliation}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Purchase Order Entry */}
  <div className="mb-4">
    <h5>8. Purchase Order Entry</h5>
    <p>Record a Purchase Order in Tally ERP.9 for the following details:</p>
    <ul>
      <li>Date: 10th December 2024</li>
      <li>Supplier: ABC Suppliers</li>
      <li>Items:
        <ul>
          <li>Product: Laptops (10 units at ₹50,000 each)</li>
          <li>Product: Mouse (50 units at ₹500 each)</li>
        </ul>
      </li>
    </ul>
    <textarea
      className="form-control"
      name="purchaseOrderEntry"
      value={studentDetails.purchaseOrderEntry}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Sales Order Entry */}
  <div className="mb-4">
    <h5>9. Sales Order Entry</h5>
    <p>Record a Sales Order in Tally ERP.9 for the following details:</p>
    <ul>
      <li>Date: 12th December 2024</li>
      <li>Customer: M/s Reliable Traders</li>
      <li>Items:
        <ul>
          <li>Product: Mobile Phones (20 units at ₹15,000 each)</li>
          <li>Product: Headphones (30 units at ₹2,000 each)</li>
        </ul>
      </li>
    </ul>
    <textarea
      className="form-control"
      name="salesOrderEntry"
      value={studentDetails.salesOrderEntry}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Tracking Order Vouchers */}
  <div className="mb-4">
    <h5>10. Tracking Order Vouchers</h5>
    <p>Record a Purchase Order for 15 chairs at ₹2,000 each from XYZ Furniture on 1st December 2024.</p>
    <p>On 5th December 2024, record a Receipt Note for 10 chairs from the same order.</p>
    <p>Generate the Outstanding Purchase Order Report to track the pending quantity.</p>
    <textarea
      className="form-control"
      name="trackingOrderVouchers"
      value={studentDetails.trackingOrderVouchers}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>
</div>
<div className="mb-4">
  <h4>Part C: Subjective Questions (8 x 5 = 40 Marks)</h4>

  {/* Question 1 */}
  <div className="mb-4">
    <h5>1. Define the Gateway of Tally. And types of vouchers with shortcut keys.</h5>
    <textarea
      className="form-control"
      name="gatewayOfTally"
      value={studentDetails.gatewayOfTally}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Question 2 */}
  <div className="mb-4">
    <h5>2. List the steps to enable GST in Tally ERP.9 and explain its importance in accounting.</h5>
    <textarea
      className="form-control"
      name="enableGST"
      value={studentDetails.enableGST}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Question 3 */}
  <div className="mb-4">
    <h5>3. Explain the difference between Single Ledger Creation and Multiple Ledger Creation in Tally ERP.9.</h5>
    <textarea
      className="form-control"
      name="ledgerCreationDifference"
      value={studentDetails.ledgerCreationDifference}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Question 4 */}
  <div className="mb-4">
    <h5>4. What is a Contra Voucher? Provide an example of when it is used.</h5>
    <textarea
      className="form-control"
      name="contraVoucher"
      value={studentDetails.contraVoucher}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Question 5 */}
  <div className="mb-4">
    <h5>5. Explain the rule of vouchers.</h5>
    <textarea
      className="form-control"
      name="voucherRule"
      value={studentDetails.voucherRule}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Question 6 */}
  <div className="mb-4">
    <h5>6. Explain the process of recording a sales transaction in Tally ERP.9 using GST.</h5>
    <textarea
      className="form-control"
      name="salesTransactionGST"
      value={studentDetails.salesTransactionGST}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Question 7 */}
  <div className="mb-4">
    <h5>7. What is the purpose of the Profit & Loss Account in Tally? How is it generated?</h5>
    <textarea
      className="form-control"
      name="profitLossAccount"
      value={studentDetails.profitLossAccount}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>

  {/* Question 8 */}
  <div className="mb-4">
    <h5>8. Explain the process of creating and processing a Sales Order in Tally ERP.9. How does it help in managing customer orders?</h5>
    <textarea
      className="form-control"
      name="salesOrderProcess"
      value={studentDetails.salesOrderProcess}
      onChange={handleChange}
      placeholder="Write your answer here..."
      rows="4"
      required
    />
  </div>
</div>


        <button type="submit" className="btn btn-primary">Submit Test</button>
      </form>
    </div>
  );
}

export default StudentTest;
