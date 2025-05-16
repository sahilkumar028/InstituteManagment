import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeeSlip.css';

const FeeSlip = ({ paymentId }) => {
    const [slipData, setSlipData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSlipData = async () => {
            try {
                console.log('Fetching payment data for ID:', paymentId);
                // First get the payment details
                const paymentResponse = await axios.get(`${process.env.REACT_APP_API}/api/fees-payment/${paymentId}`);
                console.log('Payment Response:', paymentResponse.data);
                const payment = paymentResponse.data;

                if (!payment || !payment.studentId) {
                    throw new Error('Invalid payment data received');
                }

                console.log('Fetching student data for ID:', payment.studentId);
                // Then get the student details
                const studentResponse = await axios.get(`${process.env.REACT_APP_API}/api/students/${payment.studentId}`);
                console.log('Student Response:', studentResponse.data);
                const student = studentResponse.data;

                if (!student) {
                    throw new Error('Student data not found');
                }

                // Combine the data
                const combinedData = {
                    ...payment,
                    student: student
                };
                console.log('Combined Data:', combinedData);
                setSlipData(combinedData);
                setLoading(false);
            } catch (err) {
                console.error('Detailed error:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    headers: err.response?.headers
                });
                setError(`Error loading fee slip data: ${err.message}`);
                setLoading(false);
            }
        };

        if (paymentId) {
            console.log('Starting data fetch for payment ID:', paymentId);
            fetchSlipData();
        } else {
            console.error('No payment ID provided');
            setError('No payment ID provided');
            setLoading(false);
        }
    }, [paymentId]);

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        window.history.back();
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading receipt...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                        <button className="btn btn-primary" onClick={handleBack}>Go Back</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!slipData || !slipData.student) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <div className="alert alert-warning" role="alert">
                            No slip data found
                        </div>
                        <button className="btn btn-primary" onClick={handleBack}>Go Back</button>
                    </div>
                </div>
            </div>
        );
    }

    const { student } = slipData;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-secondary me-2" onClick={handleBack}>
                    <i className="fas fa-arrow-left"></i> Back
                </button>
                <button className="btn btn-primary" onClick={handlePrint}>
                    <i className="fas fa-print"></i> Print Slip
                </button>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="text-center mb-4">
                        <h1 className="display-4">SAHA INSTITUTE</h1>
                        <p className="lead">Sector -3 Ballabgarh, Faridabad, (Haryana)</p>
                        <h2 className="h3">Fee Receipt</h2>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <strong>Receipt No:</strong> {slipData.receiptNumber || 'N/A'}
                            </div>
                            <div className="mb-3">
                                <strong>Date:</strong> {new Date(slipData.paymentDate).toLocaleDateString()}
                            </div>
                            <div className="mb-3">
                                <strong>Student Name:</strong> {student.name || 'N/A'}
                            </div>
                            <div className="mb-3">
                                <strong>Father Name:</strong> {slipData.fatherName || 'N/A'}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <strong>Registration No:</strong> {student.regId || 'N/A'}
                            </div>
                            <div className="mb-3">
                                <strong>Course:</strong> {student.course || 'N/A'}
                            </div>
                            <div className="mb-3">
                                <strong>Session:</strong> {`${new Date(slipData.paymentDate).getFullYear()}-${new Date(slipData.paymentDate).getFullYear() + 1}`}
                            </div>
                            <div className="mb-3">
                                <strong>Timing:</strong> {student.timing || 'N/A'}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <strong>Payment Method:</strong> {slipData.paymentMethod || 'N/A'}
                            </div>
                            <div className="mb-3">
                                <strong>Status:</strong> {slipData.status || 'N/A'}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <strong>Received Amount:</strong> ₹{slipData.amount || 0} Only
                            </div>
                            <div className="mb-3">
                                <strong>Balance Amount:</strong> ₹{(student.totalAmount || 0) - (slipData.amount || 0)}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="text-center">
                                <p><strong>Student Signature</strong></p>
                                <div className="border-top border-dark" style={{ width: '200px', margin: '0 auto' }}></div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="text-center">
                                <p><strong>Authorized Signature</strong></p>
                                <div className="border-top border-dark" style={{ width: '200px', margin: '0 auto' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 small text-muted">
                        <p className="mb-1">Fees once paid are non-refundable.</p>
                        <p className="mb-1">Students must countersign the receipt slip (matching the signature on the admission form) when depositing the fee.</p>
                        <p className="mb-1">Without this countersignature, no certificate will be issued, and the fee will not be recorded in the Saha account.</p>
                        <p className="mb-1">Cutting or overwriting on forms is not allowed. Only cancellation is permitted.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeeSlip; 