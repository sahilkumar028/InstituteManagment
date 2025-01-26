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
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;

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
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/students/download`, {
                responseType: 'blob', // Important for downloading files
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'students.xlsx'); // File name
            document.body.appendChild(link);
            link.click(); // Trigger download
            link.remove(); // Clean up
        } catch (error) {
            console.error('Error downloading Excel file:', error);
            alert('Failed to download the Excel sheet.');
        }
    };

    const handleComplete = async (id) => {
        try {
            await axios.put(`${process.env.REACT_APP_API}/api/students/${id}/complete`);
            setStudents(students.map(student =>
                student._id === id ? { ...student, courseStatus: 'Complete' } : student
            ));
            alert('Course status updated to Complete');
        } catch (error) {
            console.error('Failed to update course status:', error);
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API}/api/students/${id}`);
            setStudents(students.filter(student => student._id !== id));
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const filterStudents = () => {
        return students
            .filter(student => {
                const matchesName = student.name.toLowerCase().includes(searchName.toLowerCase());
                const matchesFatherName = searchFatherName
                    ? student.fatherName.toLowerCase().includes(searchFatherName.toLowerCase())
                    : true;
                return matchesName && matchesFatherName;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
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
                    <div className="col-md-6">
                        <label htmlFor="Name" className="form-label f_20">Name</label>
                        <input
                            type="text"
                            placeholder="Search by Name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Father's Name" className="form-label f_20">Father's Name</label>
                        <input
                            type="text"
                            placeholder="Search by Father's Name"
                            value={searchFatherName}
                            onChange={(e) => setSearchFatherName(e.target.value)}
                            className="form-control mb-2"
                        />
                    </div>
                </div>
            

                <div className="d-flex justify-content-end mb-3">
                    <button onClick={handleDownloadExcel} className="btn btn-success">
                        <i className="fas fa-download"></i> Download Excel
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
                                    <button onClick={() => handleICard(student._id)} className="btn text-primary btn-sm w-100 mb-2">
                                        <i className="fas fa-id-card"></i> ID Card
                                    </button>
                                    <button onClick={() => handleUpdate(student._id)} className="btn text-warning btn-sm w-100 mb-2">
                                        <i className="fas fa-edit"></i> Update
                                    </button>
                                    <button onClick={() => handleComplete(student._id)} className="btn text-success btn-sm w-100 mb-2">
                                        <i className="fas fa-check-circle"></i> Complete
                                    </button>
                                    <button onClick={() => handleIssued(student)} className="btn text-info btn-sm w-100 mb-2">
                                        <i className="fas fa-check-square"></i> Issued
                                    </button>
                                    <button onClick={() => handleDelete(student._id)} className="btn text-danger btn-sm w-100 mb-2">
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                
            </div>

            <div className="pagination mt-15px">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'} me-2`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StudentList;
