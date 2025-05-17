import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './liststudent.css';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchName, setSearchName] = useState('');
    const [searchFatherName, setSearchFatherName] = useState('');
    const [searchRegId, setSearchRegId] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;
    const [isDownloading, setIsDownloading] = useState(false);

    const courses = [
        'Office Automation',
        'Diploma in Computer Application and Accounting',
        'Advance Diploma in Computer Application',
        'Advance Excel',
        'Tally/Tally Prime',
        'Auto CAD',
        'Web designing',
        'Web Development using MERN',
        'Web Development using Java Springboot',
        'C Language',
        'C++ Language',
        'Core Java',
        'Advance Java',
        'Python',
        'Data Structure and Algorithms',
        'Spoken',
        'Certificate Courses'
    ];

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/students`);
                setStudents(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleDownloadExcel = async () => {
        console.log('=== Starting Excel Download Process ===');
        try {
            setIsDownloading(true);
            console.log('Making API request to download Excel...');
            
            const response = await axios.get(
                `${process.env.REACT_APP_API}/api/students/download-excel`,
                {
                    responseType: 'blob',
                    headers: {
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    },
                    timeout: 30000 // 30 second timeout
                }
            );

            console.log('Received response from server:', {
                status: response.status,
                headers: response.headers,
                dataSize: response.data.size
            });

            if (!response.data || response.data.size === 0) {
                throw new Error('Received empty response from server');
            }

            // Create a blob from the response data
            console.log('Creating blob from response data...');
            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            
            // Create a URL for the blob
            console.log('Creating object URL...');
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            console.log('Creating download link...');
            const link = document.createElement('a');
            link.href = url;
            const fileName = `students-list-${new Date().toISOString().split('T')[0]}.xlsx`;
            link.download = fileName;
            
            // Append to body, click, and remove
            console.log('Triggering download...');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the URL
            console.log('Cleaning up...');
            window.URL.revokeObjectURL(url);

            console.log('=== Excel Download Process Completed Successfully ===');
        } catch (error) {
            console.error('=== Error in Excel Download Process ===');
            console.error('Error details:', error);
            
            let errorMessage = 'Failed to download the Excel sheet. ';
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Server response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
                
                if (error.response.status === 404) {
                    errorMessage += 'No students found to export.';
                } else if (error.response.status === 500) {
                    errorMessage += 'Server error occurred. Please try again later.';
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                errorMessage += 'No response from server. Please check your connection.';
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Request setup error:', error.message);
                errorMessage += error.message;
            }
            
            alert(errorMessage);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleComplete = async (id) => {
        try {
            const student = students.find(s => s._id === id);
            const newStatus = student.courseStatus === 'Complete' ? 'Not Complete' : 'Complete';
            
            const response = await axios.put(`${process.env.REACT_APP_API}/api/students/${id}/complete`, {
                courseStatus: newStatus
            });
            
            if (response.data) {
                setStudents(students.map(student =>
                    student._id === id ? { ...student, courseStatus: newStatus } : student
                ));
                alert(`Course status updated to ${newStatus}`);
            }
        } catch (error) {
            console.error('Failed to update course status:', error);
            alert('Failed to update course status. Please try again.');
        }
    };

    const handleICard = (id) => {
        navigate(`/idcard/${id}`);
    };

    const handleUpdate = (id) => {
        navigate(`/update/${id}`);
    };

    const handleIssued = (student) => {
        navigate(`/issued/${student._id}`, { state: { student } });
    };

    const handleFeesPayment = (student) => {
        navigate(`/FeesPayment`, { state: { student } });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API}/api/students/${id}`);
            setStudents(students.filter(student => student._id !== id));
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const filterStudents = () => {
        return students.filter(student => {
            const matchesName = student.name.toLowerCase().includes(searchName.toLowerCase());
            const matchesFatherName = searchFatherName ? student.fatherName.toLowerCase().includes(searchFatherName.toLowerCase()) : true;
            const matchesRegId = searchRegId ? student.regId.toString().includes(searchRegId) : true;
            const matchesCourse = selectedCourse ? student.course === selectedCourse : true;
    
            const studentDate = new Date(student.date);
            const from = fromDate ? new Date(fromDate) : null;
            const to = toDate ? new Date(toDate) : null;
            const matchesDate = (!from || studentDate >= from) && (!to || studentDate <= to);
    
            return matchesName && matchesFatherName && matchesRegId && matchesCourse && matchesDate;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const filteredStudents = filterStudents();

    // Pagination logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mt-15px">
            <h2 className="mb-2 color-darkcyan">Student List</h2>

            <div className="mb-3 search-card p-2">
                <div className="row">
                    <div className="col-md-4">
                        <label htmlFor="Name" className="form-label f_20">Name</label>
                        <input
                            type="text"
                            placeholder="Search by Name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="Father's Name" className="form-label f_20">Father's Name</label>
                        <input
                            type="text"
                            placeholder="Search by Father's Name"
                            value={searchFatherName}
                            onChange={(e) => setSearchFatherName(e.target.value)}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="Registration" className="form-label f_20">Registration No.</label>
                        <input
                            type="text"
                            placeholder="Search by Registration No."
                            value={searchRegId}
                            onChange={(e) => setSearchRegId(e.target.value)}
                            className="form-control mb-2"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <label htmlFor="Course" className="form-label f_20">Course</label>
                        <select
                            className="form-control mb-2"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">All Courses</option>
                            {courses.map((course, index) => (
                                <option key={index} value={course}>{course}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label f_20">From Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label f_20">To Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end mb-3">
                    <button 
                        onClick={handleDownloadExcel} 
                        className="btn btn-success"
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Downloading...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-download me-2"></i>
                                Download Excel
                            </>
                        )}
                    </button>
                </div>
                <div className='overflow-auto '>
                <table className="table table-bordered table-striped text-center">
                    <thead className="thead-light">
                        <tr>
                            <th className="max-width-150px">S. No.</th>
                            <th className="max-width-150px">Registration No.</th>
                            <th className="max-width-150px">Date</th>
                            <th className="max-width-150px">Photo</th>
                            <th>Name</th>
                            <th>Father's Name</th>
                            <th>Mother's Name</th>
                            <th>Date of Birth</th>
                            <th>Age</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Course</th>
                            <th>Fees</th>
                            <th>Duration</th>
                            <th>Duration Option</th>
                            <th>Marksheet</th>
                            <th>Aadhaar</th>
                            <th>Reference</th>
                            <th>Course Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.map((student, index) => (
                            <tr key={student._id}>
                                <td>{indexOfFirstStudent + index + 1}</td>
                                <td>{student.regId}</td>
                                <td>{new Date(student.date).toLocaleDateString()}</td>
                                <td>
                                    <img
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        src={`${process.env.REACT_APP_API}/api/images/${student.photo}`}
                                        alt="Student"
                                    />
                                </td>
                                <td>{student.name}</td>
                                <td>{student.fatherName}</td>
                                <td>{student.motherName}</td>
                                <td>{new Date(student.dob).toLocaleDateString()}</td>
                                <td>{student.age}</td>
                                <td>{student.email}</td>
                                <td>
                                    <a href={`tel:+91${student.phone}`} target="_blank" rel="noopener noreferrer">{student.phone}</a>
                                </td>
                                <td>{student.address}</td>
                                <td>{student.course}</td>
                                <td>{student.fees}</td>
                                <td>{student.duration}</td>
                                <td>{student.durationOption}</td>
                                <td>
                                    <a href={`${process.env.REACT_APP_API}/api/images/${student.marksheet}`} target="_blank" rel="noopener noreferrer" className="color-primary">View</a>
                                </td>
                                <td>
                                    <a href={`${process.env.REACT_APP_API}/api/images/${student.aadhaar}`} target="_blank" rel="noopener noreferrer" className="color-primary">View</a>
                                </td>
                                <td>{student.reference}</td>
                                <td>{student.courseStatus}</td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button
                                            className={`btn ${student.courseStatus === 'Complete' ? 'btn-success' : 'btn-warning'} btn-sm`}
                                            onClick={() => handleComplete(student._id)}
                                        >
                                            {student.courseStatus === 'Complete' ? 'Complete' : 'Not Complete'}
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleUpdate(student._id)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => handleICard(student._id)}
                                        >
                                            <i className="fas fa-id-card"></i>
                                        </button>
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleIssued(student)}
                                        >
                                            <i className="fas fa-certificate"></i>
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleFeesPayment(student)}
                                        >
                                            <i className="fas fa-money-bill"></i>
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(student._id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                
            </div>

            {/* <div className="pagination mt-15px">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'} me-2`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div> */}
            <div className="pagination mt-15px">
                {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    // Show the first 1 pages, last 1 pages, and 3 pages around the current page
                    if (page <= 1 || page > totalPages - 1 || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                        <button
                        key={index}
                        onClick={() => handlePageChange(page)}
                        className={`btn ${currentPage === page ? 'btn-primary' : 'btn-secondary'} me-2`}
                        >
                        {page}
                        </button>
                    );
                    }
                    // Show "..." for skipped pages
                    if (page === 2 || page === totalPages - 2) {
                    return (
                        <button
                        key={index}
                        className="btn btn-secondary disabled me-2"
                        disabled
                        >
                        ...
                        </button>
                    );
                    }
                    return null; // Skip pages that do not meet the criteria
                })}
                </div>


        </div>
    );
};

export default StudentList;
