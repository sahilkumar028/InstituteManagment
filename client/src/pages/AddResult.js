import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddResult.css';

const AddResult = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        registration: '',
        name: '',
        fathersname: '',
        mothersname: '',
        dob: '',
        rollno: '',
        erollno: '',
        IssueSession: '',
        duration: '',
        performance: '',
        certificate: '',
        Grade: '',
        IssueDay: '',
        IssueMonth: '',
        IssueYear: '',
        rows: [{ subject: '', theory: 0, practical: 0, obtained: 0 }]
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRowChange = (index, field, value) => {
        const newRows = [...formData.rows];
        newRows[index] = {
            ...newRows[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            rows: newRows
        }));
    };

    const addRow = () => {
        setFormData(prev => ({
            ...prev,
            rows: [...prev.rows, { subject: '', theory: 0, practical: 0, obtained: 0 }]
        }));
    };

    const removeRow = (index) => {
        const newRows = formData.rows.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            rows: newRows
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API}/result`, formData);
            navigate('/ListResult');
        } catch (error) {
            console.error('Error adding result:', error);
        }
    };

    return (
        <div className="add-result-container">
            <h2>Add New Result</h2>
            <form onSubmit={handleSubmit} className="result-form">
                <div className="form-section">
                    <h3>Student Information</h3>
                    <div className="form-group">
                        <label>Registration:</label>
                        <input
                            type="text"
                            name="registration"
                            value={formData.registration}
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
                        <label>Father's Name:</label>
                        <input
                            type="text"
                            name="fathersname"
                            value={formData.fathersname}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mother's Name:</label>
                        <input
                            type="text"
                            name="mothersname"
                            value={formData.mothersname}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth:</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Course Information</h3>
                    <div className="form-group">
                        <label>Roll No:</label>
                        <input
                            type="text"
                            name="rollno"
                            value={formData.rollno}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>E-Roll No:</label>
                        <input
                            type="text"
                            name="erollno"
                            value={formData.erollno}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Session:</label>
                        <input
                            type="text"
                            name="IssueSession"
                            value={formData.IssueSession}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Duration:</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Result Details</h3>
                    <div className="form-group">
                        <label>Performance:</label>
                        <input
                            type="text"
                            name="performance"
                            value={formData.performance}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Certificate:</label>
                        <input
                            type="text"
                            name="certificate"
                            value={formData.certificate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Grade:</label>
                        <input
                            type="text"
                            name="Grade"
                            value={formData.Grade}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Issue Date</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Day:</label>
                            <input
                                type="number"
                                name="IssueDay"
                                value={formData.IssueDay}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Month:</label>
                            <input
                                type="number"
                                name="IssueMonth"
                                value={formData.IssueMonth}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Year:</label>
                            <input
                                type="number"
                                name="IssueYear"
                                value={formData.IssueYear}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Subject Marks</h3>
                    {formData.rows.map((row, index) => (
                        <div key={index} className="subject-row">
                            <div className="form-group">
                                <label>Subject:</label>
                                <input
                                    type="text"
                                    value={row.subject}
                                    onChange={(e) => handleRowChange(index, 'subject', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Theory:</label>
                                <input
                                    type="number"
                                    value={row.theory}
                                    onChange={(e) => handleRowChange(index, 'theory', parseInt(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Practical:</label>
                                <input
                                    type="number"
                                    value={row.practical}
                                    onChange={(e) => handleRowChange(index, 'practical', parseInt(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Obtained:</label>
                                <input
                                    type="number"
                                    value={row.obtained}
                                    onChange={(e) => handleRowChange(index, 'obtained', parseInt(e.target.value))}
                                    required
                                />
                            </div>
                            <button type="button" onClick={() => removeRow(index)} className="remove-btn">
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addRow} className="add-btn">
                        Add Subject
                    </button>
                </div>

                <button type="submit" className="submit-btn">Add Result</button>
            </form>
        </div>
    );
};

export default AddResult; 