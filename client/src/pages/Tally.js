import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

function Tally() {
  const [studentDetails, setStudentDetails] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : {
      name: '',
      batchTime: '',
      teacherName: '',
      answer: {
        partA: { 
          partAQ1:'',
          partAQ2:'',
          partAQ3:'',
          partAQ4:'',
          partAQ5:'',
          partAQ6:'',
          partAQ7:'',
          partAQ8:'',
          partAQ9:'',
          partAQ10:'',
        },
        partB: {
          a:''
        },
        partC: {
          a:''
        },
      },
    };
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(studentDetails));
  }, [studentDetails]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Update simple fields (name, batchTime, teacherName)
    if (name === 'name' || name === 'batchTime' || name === 'teacherName') {
      setStudentDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    } else {
      // For nested fields (answers in parts A, B, C)
      setStudentDetails((prevDetails) => ({
        ...prevDetails,
        answer: {
          ...prevDetails.answer,
          partA: name.startsWith('partA') ? {
            ...prevDetails.answer.partA,
            [name]: value,
          } : prevDetails.answer.partA,
          
          partB: name.startsWith('partB') ? {
            ...prevDetails.answer.partB,
            [name]: value,
          } : prevDetails.answer.partB,
          
          partC: name.startsWith('partC') ? {
            ...prevDetails.answer.partC,
            [name]: value,
          } : prevDetails.answer.partC,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sending data to the server
      const response = await axios.post(process.env.REACT_APP_API + '/studentTest', studentDetails);

      // Handle successful response
      console.log("Test Submitted:", response.data); 
      alert("Test Submitted Successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting the test. Please try again.");
    }
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
              name="partAQ1"
              value="F11"
              checked={studentDetails.answer.partA.partAQ1 === 'F11'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) F11</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ1"
              value="F12"
              checked={studentDetails.answer.partA.partAQ1 === 'F12'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) F12</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ1"
              value="Alt + F3"
              checked={studentDetails.answer.partA.partAQ1 === 'Alt + F3'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Alt + F3</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ1"
              value="Alt + F1"
              checked={studentDetails.answer.partA.partAQ1 === 'Alt + F1'}
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
              name="partAQ2"
              value="Purchase Voucher"
              checked={studentDetails.answer.partA.partAQ2 === 'Purchase Voucher'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Purchase Voucher</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ2"
              value="Sales Voucher"
              checked={studentDetails.answer.partA.partAQ2 === 'Sales Voucher'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Sales Voucher</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ2"
              value="Payment Voucher"
              checked={studentDetails.answer.partA.partAQ2 === 'Payment Voucher'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Payment Voucher</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ2"
              value="Receipt Voucher"
              checked={studentDetails.answer.partA.partAQ2 === 'Receipt Voucher'}
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
              name="partAQ3"
              value="Double Click on D"
              checked={studentDetails.answer.partA.partAQ3 === 'Double Click on D'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Double Click on D</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ3"
              value="Ctrl + F4"
              checked={studentDetails.answer.partA.partAQ3 === 'Ctrl + F4'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Ctrl + F4</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ3"
              value="D (while in Gateway of Tally)"
              checked={studentDetails.answer.partA.partAQ3 === 'D (while in Gateway of Tally)'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) D (while in Gateway of Tally)</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ3"
              value="Alt + F5"
              checked={studentDetails.answer.partA.partAQ3 === 'Alt + F5'}
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
              name="partAQ4"
              value="Creates a new company"
              checked={studentDetails.answer.partA.partAQ4 === 'Creates a new company'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Creates a new company</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ4"
              value="Opens the Company menu"
              checked={studentDetails.answer.partA.partAQ4 === 'Opens the Company menu'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Opens the Company menu</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ4"
              value="Creates a master (e.g., Ledger or Stock Item)"
              checked={studentDetails.answer.partA.partAQ4 === 'Creates a master (e.g., Ledger or Stock Item)'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Creates a master (e.g., Ledger or Stock Item)</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ4"
              value="Copies a transaction"
              checked={studentDetails.answer.partA.partAQ4 === 'Copies a transaction'}
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
              name="partAQ5"
              value="Stock Summary"
              checked={studentDetails.answer.partA.partAQ5 === 'Stock Summary'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Stock Summary</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ5"
              value="Profit and Loss Account"
              checked={studentDetails.answer.partA.partAQ5 === 'Profit and Loss Account'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Profit and Loss Account</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ5"
              value="Balance Sheet"
              checked={studentDetails.answer.partA.partAQ5 === 'Balance Sheet'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Balance Sheet</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ5"
              value="Outstanding Report"
              checked={studentDetails.answer.partA.partAQ5 === 'Outstanding Report'}
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
              name="partAQ6"
              value="Inventory Features"
              checked={studentDetails.answer.partA.partAQ6 === 'Inventory Features'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Inventory Features</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ6"
              value="Statutory & Taxation"
              checked={studentDetails.answer.partA.partAQ6 === 'Statutory & Taxation'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Statutory & Taxation</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ6"
              value="Accounting Features"
              checked={studentDetails.answer.partA.partAQ6 === 'Accounting Features'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Accounting Features</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ6"
              value="Payroll Features"
              checked={studentDetails.answer.partA.partAQ6 === 'Payroll Features'}
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
              name="partAQ7"
              value="F11"
              checked={studentDetails.answer.partA.partAQ7 === 'F11'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) F11</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ7"
              value="F12"
              checked={studentDetails.answer.partA.partAQ7 === 'F12'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) F12</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ7"
              value="Alt + F1"
              checked={studentDetails.answer.partA.partAQ7 === 'Alt + F1'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Alt + F1</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ7"
              value="Ctrl + A"
              checked={studentDetails.answer.partA.partAQ7 === 'Ctrl + A'}
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
              name="partAQ8"
              value="To record cash or bank transactions within the business"
              checked={studentDetails.answer.partA.partAQ8 === 'To record cash or bank transactions within the business'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) To record cash or bank transactions within the business</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ8"
              value="To record purchases on credit"
              checked={studentDetails.answer.partA.partAQ8 === 'To record purchases on credit'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) To record purchases on credit</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ8"
              value="To record sales on credit"
              checked={studentDetails.answer.partA.partAQ8 === 'To record sales on credit'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) To record sales on credit</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ8"
              value="To record GST payments"
              checked={studentDetails.answer.partA.partAQ8 === 'To record GST payments'}
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
              name="partAQ9"
              value="Balance Sheet"
              checked={studentDetails.answer.partA.partAQ9 === 'Balance Sheet'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Balance Sheet</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ9"
              value="Stock Summary"
              checked={studentDetails.answer.partA.partAQ9 === 'Stock Summary'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Stock Summary</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ9"
              value="Profit & Loss Account"
              checked={studentDetails.answer.partA.partAQ9 === 'Profit & Loss Account'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Profit & Loss Account</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ9"
              value="Daybook"
              checked={studentDetails.answer.partA.partAQ9 === 'Daybook'}
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
              name="partAQ10"
              value="Display Menu"
              checked={studentDetails.answer.partA.partAQ10 === 'Display Menu'}
              onChange={handleChange}
            />
            <label className="form-check-label">a) Display Menu</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ10"
              value="Gateway of Tally > Accounts Info"
              checked={studentDetails.answer.partA.partAQ10 === 'Gateway of Tally > Accounts Info'}
              onChange={handleChange}
            />
            <label className="form-check-label">b) Gateway of Tally  Accounts Info</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ10"
              value="Chart of Accounts"
              checked={studentDetails.answer.partA.partAQ10 === 'Chart of Accounts'}
              onChange={handleChange}
            />
            <label className="form-check-label">c) Chart of Accounts</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="partAQ10"
              value="Statutory Features"
              checked={studentDetails.answer.partA.partAQ10 === 'Statutory Features'}
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
              name="partBQ1"
              value={studentDetails.answer.partB.partBQ1}
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
              name="partBQ2"
              value={studentDetails.answer.partB.partBQ2}
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
              name="partBQ3"
              value={studentDetails.answer.partB.partBQ3}
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
              name="partBQ4"
              value={studentDetails.answer.partB.partBQ4}
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
              name="partBQ5"
              value={studentDetails.answer.partB.partBQ5}
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
              name="partBQ6"
              value={studentDetails.answer.partB.partBQ6}
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
              name="partBQ7"
              value={studentDetails.answer.partB.partBQ7}
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
              name="partBQ8"
              value={studentDetails.answer.partB.partBQ8}
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
              name="partBQ9"
              value={studentDetails.answer.partB.partBQ9}
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
              name="partBQ10"
              value={studentDetails.answer.partB.partBQ10}
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
              name="partCQ1"
              value={studentDetails.answer.partC.partCQ1}
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
              name="partCQ2"
              value={studentDetails.answer.partC.partCQ2}
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
              name="partCQ3"
              value={studentDetails.answer.partC.partCQ3}
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
              name="partCQ4"
              value={studentDetails.answer.partC.partCQ4}
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
              name="partCQ5"
              value={studentDetails.answer.partC.partCQ5}
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
              name="partCQ6"
              value={studentDetails.answer.partC.partCQ6}
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
              name="partCQ7"
              value={studentDetails.answer.partC.partCQ7}
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
              name="partCQ8"
              value={studentDetails.answer.partC.partCQ8}
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

export default Tally;
