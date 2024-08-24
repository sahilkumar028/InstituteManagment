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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormValues(prevValues => ({
                ...prevValues,
                photo: reader.result
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
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
                return { ...row, [name]: value };
            }
            return row;
        });
        setRows(updatedRows);
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
    const nyear=[]
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

    return (
        <div className="container mt-2">
            <form method="post" action="/savedata" encType="multipart/form-data">
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
                <div className="form-group mt-4">
                    <h4>Subjects</h4>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Serial No</th>
                                    <th>Subject</th>
                                    <th>Theory Marks</th>
                                    <th>Practical Marks</th>
                                    <th>Obtained Marks</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={row.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Subject"
                                                name="subject"
                                                value={row.subject}
                                                onChange={(e) => handleRowChange(row.id, e)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Theory Marks"
                                                name="theory"
                                                value={row.theory}
                                                onChange={(e) => handleRowChange(row.id, e)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Practical Marks"
                                                name="practical"
                                                value={row.practical}
                                                onChange={(e) => handleRowChange(row.id, e)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Obtained Marks"
                                                name="obtained"
                                                value={row.obtained}
                                                onChange={(e) => handleRowChange(row.id, e)}
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
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleAddRow}
                        >
                            Add Row
                        </button>
                    </div>
                </div>

                {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

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

                
                <button type="submit" className="btn btn-primary mt-4">Submit</button>
            </form>
        </div>
    );
};

export default IssuedCertificate;
