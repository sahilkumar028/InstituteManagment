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
        photo: process.env.REACT_APP_API+'/api/images/' + (student?.photo || ''),
        registration: student?.regId || '',
        name: student?.name || '',
        fathersname: student?.fatherName || '',
        mothersname: student?.motherName || '',
        dob: formatDate(student?.dob) || '',
        rollno: student?.regId || '',
        erollno: student?.regId[0] + student?.regId || '',
        IssueSession: '',
        duration: student?.duration || '',
        performance: '',
        certificate: student?.course || '',
        Grade: '',
        IssueDay: '',
        IssueYear: '',
        IssueMonth: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const courses = [
        { name: 'Office Automation'},
        { name: 'Diploma in Computer Application and Accounting'},
        { name: 'Advance Diploma in Computer Application'},
        { name: 'Certificate Courses'},
        { name: 'Spoken English'}
      ];

    // Move calculateGrade function above useEffect
    const calculateGrade = (updatedRows) => {
        const totalMarks = updatedRows.reduce((sum, row) => sum + parseInt(row.obtained || 0), 0);
        const percentage = (totalMarks / (updatedRows.length * 100)) * 100;
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

    useEffect(() => {
        calculateGrade(rows);
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
                const updatedRow = { ...row, [name]: value };
                if (name === "theory" || name === "practical") {
                    const theory = parseInt(updatedRow.theory) || 0;
                    const practical = parseInt(updatedRow.practical) || 0;
                    if (theory > 30 || practical > 70) {
                        setErrorMessage('Total marks in theory cannot exceed 30 and practical cannot exceed 70!');
                        updatedRow.obtained = '';
                    } else {
                        setErrorMessage('');
                        updatedRow.obtained = theory + practical;
                    }
                }
                return updatedRow;
            }
            return row;
        });

        setRows(updatedRows);
        calculateGrade(updatedRows);
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

    const dayOptions = Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        let suffix = 'th';
        
        if (day % 10 === 1 && day !== 11) {
          suffix = 'st';
        } else if (day % 10 === 2 && day !== 12) {
          suffix = 'nd';
        } else if (day % 10 === 3 && day !== 13) {
          suffix = 'rd';
        }
      
        return `${day}${suffix}`;
      });
    const monthOptions = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('1. Starting form submission...');
            console.log('2. Current form values:', formValues);
            console.log('3. Current rows data:', rows);

            const requestData = {
                ...formValues,
                rows
            };
            console.log('4. Prepared request data:', requestData);

            console.log('5. Sending request to:', process.env.REACT_APP_API+'/api/issued');
            const response = await fetch(process.env.REACT_APP_API+'/api/issued', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            
            console.log('6. Response status:', response.status);
            console.log('7. Response headers:', Object.fromEntries(response.headers.entries()));
            
            const responseData = await response.json();
            console.log('8. Response data:', responseData);

            if (response.ok) {
                console.log('9. Success: Data saved successfully');
                alert('Data saved successfully!');
            } else {
                console.error('9. Error: Failed to save data. Status:', response.status);
                console.error('Error details:', responseData);
                alert('Failed to save data: ' + (responseData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error occurred during submission:', error);
            console.error('Error stack:', error.stack);
            alert('An error occurred while saving data: ' + error.message);
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
                    <label htmlFor="IssueSession">Session</label>
                    <select
                        id="IssueSession"
                        name="IssueSession"
                        className="form-control"
                        value={formValues.session}
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
                    />
                </div>
                {/* <div className="form-group">
                    <label htmlFor="certificate">Certificate</label>
                    <input
                        type="text"
                        id="certificate"
                        name="certificate"
                        className="form-control"
                        value={formValues.certificate}
                        onChange={handleChange}
                    />
                </div> */}
                <div className="form-group">
                    <label htmlFor="certificate" className="form-label">Certificate</label>
                    <select id="certificate" name="certificate" value={formValues.certificate} onChange={handleChange} className="form-control" required>
                    <option value="">Select Course</option>
                    {courses.map((course, index) => (
                        <option key={index} value={course.name}>{course.name}</option>
                    ))}
                    </select>
                </div>
                <div className="form-group">
                    <label className='h3'>Subjects</label>
                    <div className="row mb-3">
                        <div className="h6 col-sm-1">
                            Serial No
                        </div>
                        <div className="h6 col-sm">
                            Subject
                        </div>
                        <div className="h6 col-sm">
                            Theory Marks (Max 30)
                        </div>
                        <div className="h6 col-sm">
                            Practical Marks (Max 70)
                        </div>
                        <div className="h6 col-sm">
                            Obtained Marks
                        </div>
                        <div className="h6 col-sm">
                            Actions
                        </div>
                    </div>
                    {rows.map((row, index) => (
                        <div key={row.id} className="row mb-3">
                            <div className="col-sm-1 text-center">
                                {index + 1}
                            </div>
                            <div className="col-sm">
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    name="subject"
                                    value={row.subject}
                                    className="form-control"
                                    onChange={(e) => handleRowChange(row.id, e)}
                                />
                            </div>
                            <div className="col-sm">
                                <input
                                    type="number"
                                    placeholder="Theory"
                                    name="theory"
                                    value={row.theory}
                                    className="form-control"
                                    onChange={(e) => handleRowChange(row.id, e)}
                                />
                            </div>
                            <div className="col-sm">
                                <input
                                    type="number"
                                    placeholder="Practical"
                                    name="practical"
                                    value={row.practical}
                                    className="form-control"
                                    onChange={(e) => handleRowChange(row.id, e)}
                                />
                            </div>
                            <div className="col-sm">
                                <input
                                    type="number"
                                    placeholder="Obtained"
                                    name="obtained"
                                    value={row.obtained}
                                    className="form-control"
                                    readOnly
                                />
                            </div>
                            <div className="col-sm">
                                {index >= 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveRow(row.id)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {rows.length < 5 && (
                        <button type="button" className="btn btn-primary" onClick={handleAddRow}>
                            Add Subject
                        </button>
                    )}
                </div>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                
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
                        required
                    >
                        <option value="">Select Month</option>
                        {monthOptions.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
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
                <button type="submit" className="btn btn-success mt-3">Save</button>
            </form>
        </div>
    );
};

export default IssuedCertificate;
