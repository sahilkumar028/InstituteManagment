import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './FeesPayment.css';
import FeeSlip from './FeeSlip';

const FeesPayment = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [payments, setPayments] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState(null);
    const [formData, setFormData] = useState({
        amount: '',
        paymentMethod: 'Cash',
        remarks: ''
    });
    const [selectedPayment, setSelectedPayment] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if student data was passed through navigation state
        if (location.state?.student) {
            const student = location.state.student;
            setSelectedStudent(student);
            fetchPayments(student._id);
            fetchPaymentSummary(student._id);
        } else {
            // If no student data, redirect back to student list
            navigate('/ListStudents');
        }
    }, [location.state, navigate]);

    const fetchPayments = async (studentId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/fees-payments/student/${studentId}`);
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const fetchPaymentSummary = async (studentId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/fees-payments/summary/${studentId}`);
            setPaymentSummary(response.data);
        } catch (error) {
            console.error('Error fetching payment summary:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API}/fees-payment`, {
                studentId: selectedStudent._id,
                ...formData
            });
            fetchPayments(selectedStudent._id);
            fetchPaymentSummary(selectedStudent._id);
            setFormData({
                amount: '',
                paymentMethod: 'Cash',
                remarks: ''
            });
        } catch (error) {
            console.error('Error creating payment:', error);
        }
    };

    const handleViewSlip = async (paymentId) => {
        setSelectedPayment(paymentId);
    };

    if (!selectedStudent) {
        return null; // Don't render anything if no student is selected
    }

    return (
        <div className="fees-payment-container">
            {selectedPayment ? (
                <FeeSlip paymentId={selectedPayment} />
            ) : (
                <>
                    <h2>Fee Payment Management</h2>
                    
                    <div className="student-details">
                        <h3>Student Details</h3>
                        <div className="student-info">
                            <div className="student-photo">
                                <img 
                                    src={`${process.env.REACT_APP_API}/uploads/${selectedStudent.photo}`} 
                                    alt="Student" 
                                />
                            </div>
                            <div className="student-data">
                                <p><strong>Registration No:</strong> {selectedStudent.regId}</p>
                                <p><strong>Name:</strong> {selectedStudent.name}</p>
                                <p><strong>Father's Name:</strong> {selectedStudent.fatherName}</p>
                                <p><strong>Course:</strong> {selectedStudent.course}</p>
                                <p><strong>Total Fees:</strong> ₹{selectedStudent.fees}</p>
                                <p><strong>Duration:</strong> {selectedStudent.duration} {selectedStudent.durationOption}</p>
                            </div>
                        </div>
                    </div>

                    {paymentSummary && (
                        <div className="payment-summary">
                            <h3>Payment Summary</h3>
                            <p>Total Paid: ₹{paymentSummary.totalPaid}</p>
                            <p>Remaining Amount: ₹{selectedStudent.fees - paymentSummary.totalPaid}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="payment-form">
                        <h3>New Payment</h3>
                        <div className="form-group">
                            <label>Amount:</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Payment Method:</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                            >
                                <option value="Cash">Cash</option>
                                <option value="Online">Online</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Remarks:</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit">Submit Payment</button>
                    </form>

                    <div className="payment-history">
                        <h3>Payment History</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Receipt No.</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>remarks</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(payment => (
                                    <tr key={payment._id}>
                                        <td>{payment.receiptNumber}</td>
                                        <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                        <td>₹{payment.amount}</td>
                                        <td>{payment.paymentMethod}</td>
                                        <td>{payment.remarks}</td>
                                        <td>{payment.status}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleViewSlip(payment._id)}
                                                className="btn btn-primary btn-sm"
                                            >
                                                View Receipt
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default FeesPayment; 