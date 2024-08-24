import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const IssuedCertificate = () => {
    const location = useLocation();
    const student = location.state?.student;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [rows, setRows] = useState([
        { id: Date.now(), subject: '', theory: '', practical: '', obtained: '' }
    ]);
    const [formValues, setFormValues] = useState({
        photo: 'http://localhost:5000/api/images/'+(student?.photo)|| '',
        registration: student?.regId || '',
        name: student?.name || '',
        fathersname: student?.fatherName || '',
        mothersname: student?.motherName || '',
        dob: formatDate(student?.dob) || '',
        rollno: student?.regId || '',
        erollno: student?.regId[0] + student?.regId || '',
        session: '',
        duration: student?.duration || '',
        performance: '',
        certificate: student?.course || '',
        subject:[],
        theory:[],
        practical:[],
        Grade: '',
        IssueDay: '',
        IssueYear: '',
        IssueMonth: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        calculateGrade();
    }, [rows]);

    if (!student) return <div>No student data available</div>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };


    const handleAddRow = () => {
        if (rows.length < 5) {
            setRows([...rows, { id: Date.now(), subject: '', theory: '', practical: '', obtained: '' }]);
        } else {
            alert('Maximum 5 rows allowed.');
        }
    };

    const handleRemoveRow = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };

    const handleRowChange = (id, e) => {
        const { name, value } = e.target;
        const updatedRows = rows.map(row => {
            if (row.id === id) {
                // Ensure we are updating the correct field in the row
                return { ...row, [name]: value };
            }
            return row;
        });
    
        // Debugging output to check updatedRows
        console.log('Updated Rows:', updatedRows);
        
        // Update state with new rows data
        setRows(updatedRows);
    
        // Recalculate obtained marks based on updated rows
        calculateObtainedMarks(id);
    };
    

    const calculateObtainedMarks = (id) => {
        const updatedRows = rows.map(row => {
            if (row.id === id) {
                const theory = parseInt(row.theory) || 0;
                const practical = parseInt(row.practical) || 0;
                if (theory > 30 || practical > 70) {
                    setErrorMessage('Total marks in theory cannot exceed 30 and practical cannot exceed 70!');
                    return { ...row, theory: '', practical: '', obtained: '' };
                } else {
                    setErrorMessage('');
                    return { ...row, obtained: theory + practical };
                }
            }
            return row;
        });
        setRows(updatedRows);
        calculateGrade();
    };

    const calculateGrade = () => {
        const totalMarks = rows.reduce((sum, row) => sum + parseInt(row.obtained || 0), 0);
        const percentage = (totalMarks / (rows.length * 100)) * 100;
        let grade = '';
        if (percentage >= 85) {
            grade = 'A';
        } else if (percentage >= 75 && percentage < 85) {
            grade = 'B';
        } else if (percentage >= 65 && percentage < 75) {
            grade = 'C';
        } else {
            grade = 'D';
        }
        setFormValues(prevValues => ({
            ...prevValues,
            Grade: grade,
            performance: getPerformanceBasedOnGrade(grade)
        }));
    };

    const getPerformanceBasedOnGrade = (grade) => {
        switch (grade) {
            case 'A': return 'Excellent';
            case 'B': return 'Very Good';
            case 'C': return 'Good';
            case 'D': return 'Average';
            default: return '';
        }
    };

    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    const nyear = [];
    for (let i = 0; i < 5; i++) {
        const year = currentYear - i;
        const nextYear = year + 1;
        yearOptions.push(`${year}-${String(nextYear).slice(-2)}`);
        nyear.push(`${year}`);
    }

    const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
    const monthOptions = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/savedata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formValues,
                    rows // Include rows data in the request
                }),
            });
            if (response.ok) {
                alert('Data saved successfully!');
            } else {
                alert('Failed to save data');
            }
        } catch (error) {
            alert('An error occurred while saving data');
        }
    };

    return (
        <div className="container mt-2">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    {formValues.photo && <img src={formValues.photo} alt="Preview" className="mt-2 img-thumbnail" style={{ maxWidth: '200px' }} />}
                </div>
                <div className="form-group">
                    <label htmlFor="registration">Registration No</label>
                    <input
                        type="number"
                        id="registration"
                        name="registration"
                        className="form-control"
                        value={formValues.registration}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formValues.name}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fathersname">Father's Name</label>
                    <input
                        type="text"
                        id="fathersname"
                        name="fathersname"
                        className="form-control"
                        value={formValues.fathersname}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="mothersname">Mother's Name</label>
                    <input
                        type="text"
                        id="mothersname"
                        name="mothersname"
                        className="form-control"
                        value={formValues.mothersname}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        className="form-control"
                        value={formValues.dob}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="rollno">Roll No</label>
                    <input
                        type="number"
                        id="rollno"
                        name="rollno"
                        className="form-control"
                        value={formValues.rollno}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="erollno">Enrollment No</label>
                    <input
                        type="number"
                        id="erollno"
                        name="erollno"
                        className="form-control"
                        value={formValues.erollno}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="session">Session</label>
                    <select
                        id="IssueYear"
                        name="IssueYear"
                        className="form-control"
                        value={formValues.IssueYear}
                        onChange={handleChange}
                    >
                        <option value="">Select Year</option>
                        {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="duration">Duration</label>
                    <input
                        type="text"
                        id="duration"
                        name="duration"
                        className="form-control"
                        value={formValues.duration}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="certificate">Certificate</label>
                    <input
                        type="text"
                        id="certificate"
                        name="certificate"
                        className="form-control"
                        value={formValues.certificate}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="table-responsive mt-4">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Serial No</th>
                                <th>Subject</th>
                                <th>Theory Marks (Max 30)</th>
                                <th>Practical Marks (Max 70)</th>
                                <th>Obtained Marks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={row.id}>
                                    <td className='text-center'>{index + 1}</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="subject"
                                            className="form-control"
                                            value={row.subject}
                                            onChange={(e) => handleRowChange(row.id, e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="theory"
                                            className="form-control"
                                            value={row.theory}
                                            onChange={(e) => handleRowChange(row.id, e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="practical"
                                            className="form-control"
                                            value={row.practical}
                                            onChange={(e) => handleRowChange(row.id, e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="obtained"
                                            className="form-control"
                                            value={row.obtained}
                                            disabled
                                        />
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => handleRemoveRow(row.id)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAddRow}
                    >
                        Add Subject
                    </button>
                </div>
                {errorMessage && (
                    <div className="alert alert-danger">
                        {errorMessage}
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="Grade">Grade</label>
                    <input
                        type="text"
                        id="Grade"
                        name="Grade"
                        className="form-control"
                        value={formValues.Grade}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="performance">Performance</label>
                    <input
                        type="text"
                        id="performance"
                        name="performance"
                        className="form-control"
                        value={formValues.performance}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="IssueDay">Issue Day</label>
                    <select
                        id="IssueDay"
                        name="IssueDay"
                        className="form-control"
                        value={formValues.IssueDay}
                        onChange={handleChange}
                    >
                        <option value="">Select Day</option>
                        {dayOptions.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="IssueMonth">Issue Month</label>
                    <select
                        id="IssueMonth"
                        name="IssueMonth"
                        className="form-control"
                        value={formValues.IssueMonth}
                        onChange={handleChange}
                    >
                        <option value="">Select Month</option>
                        {monthOptions.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="IssueYear">Issue Year</label>
                    <select
                        id="IssueYear"
                        name="IssueYear"
                        className="form-control"
                        value={formValues.IssueYear}
                        onChange={handleChange}
                    >
                        <option value="">Select Year</option>
                        {nyear.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group mt-4">
                    <button type="submit" className="btn btn-success">Save</button>
                </div>
            </form>
        </div>
    );
};

export default IssuedCertificate;
