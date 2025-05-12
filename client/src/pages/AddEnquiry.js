import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddEnquiry.css';

const AddEnquiry = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        name: '',
        phone: '',
        course: '',
        remarks: ''
    });

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
            await axios.post(`${process.env.REACT_APP_API}/enquiry`, formData);
            navigate('/ListEnquiry');
        } catch (error) {
            console.error('Error adding enquiry:', error);
        }
    };

    return (
        <div className="add-enquiry-container">
            <h2>Add New Enquiry</h2>
            <form onSubmit={handleSubmit} className="enquiry-form">
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Course:</label>
                    <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Remarks:</label>
                    <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        rows="4"
                    />
                </div>
                <button type="submit" className="submit-btn">Add Enquiry</button>
            </form>
        </div>
    );
};

export default AddEnquiry; 