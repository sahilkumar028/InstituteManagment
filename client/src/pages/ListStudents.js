import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchName, setSearchName] = useState('');
    const [searchFatherName, setSearchFatherName] = useState('');

    useEffect(() => {
        // Fetch students from API
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
        // Handle update logic
    };

    const handleIssued = (student) => {
        console.log('Issuing student:', student);
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
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (newest first)
    };    

    const filteredStudents = filterStudents();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="mt-2">
            <h2 className="mb-2">Student List</h2>
            <div className="mb-3">
            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="Name" className="form-label">Name</label>
                    <input
                        type="text"
                        placeholder="Search by Name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="form-control mb-2"
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="Father's Name" className="form-label">Father's Name</label>
                    <input
                        type="text"
                        placeholder="Search by Father's Name"
                        value={searchFatherName}
                        onChange={(e) => setSearchFatherName(e.target.value)}
                        className="form-control mb-2"
                    />
                </div>
            </div>
                
                
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>S. No.</th>
                        <th>Registration No.</th>
                        <th>Date</th>
                        <th>Photo</th>
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
                    {filteredStudents.map((student, index) => (
                        <tr key={student._id}>
                            <td>{index + 1}</td>
                            <td>{student.regId}</td>
                            <td>{new Date(student.date).toLocaleDateString()}</td>
                            <td>
                                <img
                                    className="w-100 h-100"
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
                            <td>{student.phone}</td>
                            <td>{student.address}</td>
                            <td>{student.course}</td>
                            <td>{student.fees}</td>
                            <td>{student.duration}</td>
                            <td>{student.durationOption}</td>
                            <td>
                                <a href={`/${student.marksheet}`} target="_blank" rel="noopener noreferrer">View</a>
                            </td>
                            <td>
                                <a href={`/${student.aadhaar}`} target="_blank" rel="noopener noreferrer">View</a>
                            </td>
                            <td>{student.reference}</td>
                            <td>{student.courseStatus}</td>
                            <td>
                                <button onClick={() => handleICard(student._id)} className="btn text-primary btn-sm me-4 w-100">
                                    <i className="fas fa-id-card"></i> ID Card
                                </button>
                                <button onClick={() => handleUpdate(student._id)} className="btn text-warning btn-sm me-4 w-100">
                                    <i className="fas fa-edit"></i> Update
                                </button>
                                <button onClick={() => handleComplete(student._id)} className="btn text-success btn-sm me-4 w-100">
                                    <i className="fas fa-check-circle"></i> Complete
                                </button>
                                <button onClick={() => handleIssued(student)} className="btn text-info btn-sm me-4 w-100">
                                    <i className="fas fa-check-square"></i> Issued
                                </button>
                                <button onClick={() => handleDelete(student._id)} className="btn text-danger btn-sm me-4 w-100">
                                    <i className="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentList;
