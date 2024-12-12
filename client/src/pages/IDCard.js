// src/components/IDCard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const IDCard = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Get the student ID from the URL

    useEffect(() => {
        // Fetch student details from API
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://192.168.1.250:5000/api/students/${id}`);
                setStudent(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!student) return <div>No student found</div>;

    return (
        <div className="id-card-container" style={{ padding: '20px', border: '1px solid #ddd', width: '300px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Student ID Card</h3>
            <div style={{ marginBottom: '10px' }}>
                <strong>Name:</strong> {student.name}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <strong>Registration No.:</strong> {student.regId}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <strong>Course:</strong> {student.course}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <strong>Father's Name:</strong> {student.fatherName}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <strong>Mother's Name:</strong> {student.motherName}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <strong>Date of Birth:</strong> {new Date(student.dob).toLocaleDateString()}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <strong>Address:</strong> {student.address}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <img src={`http://192.168.1.250:5000/api/images/${student.photo}`} alt="Student" style={{ width: '100%', borderRadius: '8px' }} />
            </div>
        </div>
    );
};

export default IDCard;
