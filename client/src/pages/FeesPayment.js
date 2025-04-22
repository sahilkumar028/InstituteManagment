import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const FeesPayment = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [paymentMode, setPaymentMode] = useState('cash');
    const [remarks, setRemarks] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [pendingFees, setPendingFees] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchStudents();
        if (location.state?.student) {
            setSelectedStudent(location.state.student);
            setSearchQuery(location.state.student.regId);
            calculatePendingFees(location.state.student);
        }
    }, [location.state]);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/students');
            setStudents(response.data);
        } catch (error) {
            setError('Failed to fetch students');
            console.error('Error fetching students:', error);
        }
    };

    const calculatePendingFees = (student) => {
        // This is a placeholder. You'll need to implement the actual calculation
        // based on your payment history and total fees
        const totalFees = parseFloat(student.fees) || 0;
        const paidAmount = 0; // Get this from your payment history
        setPendingFees(totalFees - paidAmount);
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        const foundStudent = students.find(student => 
            student.regId.toLowerCase().includes(query.toLowerCase()) ||
            student.name.toLowerCase().includes(query.toLowerCase())
        );
        
        if (foundStudent) {
            setSelectedStudent(foundStudent);
            calculatePendingFees(foundStudent);
        } else {
            setSelectedStudent(null);
            setPendingFees(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedStudent || !amount || !paymentDate) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            const paymentData = {
                studentId: selectedStudent._id,
                amount: parseFloat(amount),
                paymentDate: new Date(paymentDate),
                paymentMode,
                remarks
            };

            const response = await axios.post('http://localhost:5000/api/fees/payment', paymentData);
            setSuccess('Payment recorded successfully');
            
            // Reset form
            setSelectedStudent(null);
            setSearchQuery('');
            setAmount('');
            setPaymentDate('');
            setPaymentMode('cash');
            setRemarks('');
            setPendingFees(0);
        } catch (error) {
            setError('Failed to record payment');
            console.error('Error recording payment:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Fees Payment</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                    <Form.Label>Search Student</Form.Label>
                    <Form.Control
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Enter Registration Number or Student Name"
                        required
                    />
                </Form.Group>

                {selectedStudent && (
                    <Card className="mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={8}>
                                    <h4 className="mb-3">Student Details</h4>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Registration No:</strong> {selectedStudent.regId}</p>
                                            <p><strong>Name:</strong> {selectedStudent.name}</p>
                                            <p><strong>Father's Name:</strong> {selectedStudent.fatherName}</p>
                                            <p><strong>Course:</strong> {selectedStudent.course}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Total Fees:</strong> ₹{selectedStudent.fees}</p>
                                            <p><strong>Pending Fees:</strong> ₹{pendingFees}</p>
                                            <p><strong>Duration:</strong> {selectedStudent.duration} {selectedStudent.durationOption}</p>
                                            <p><strong>Course Status:</strong> {selectedStudent.courseStatus}</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={4} className="text-center">
                                    <img
                                        src={`http://localhost:5000/api/images/${selectedStudent.photo}`}
                                        alt="Student"
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '2px solid #ddd'
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                )}

                <Card className="mb-4">
                    <Card.Body>
                        <h4 className="mb-3">Payment Details</h4>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Payment Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Payment Mode</Form.Label>
                                    <Form.Select
                                        value={paymentMode}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                        required
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="online">Online</option>
                                        <option value="cheque">Cheque</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Enter any remarks"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="text-end">
                            <Button variant="primary" type="submit" disabled={!selectedStudent}>
                                Record Payment
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Form>

            <Card>
                <Card.Body>
                    <h4 className="mb-3">Payment History</h4>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Mode</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Payment history will be populated here */}
                            <tr>
                                <td colSpan="4" className="text-center">No payment history available</td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default FeesPayment; 