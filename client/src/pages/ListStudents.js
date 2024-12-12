import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch students from API
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://192.168.1.250:5000/api/students');
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
            await axios.put(`http://192.168.1.250:5000/api/students/${id}/complete`);
            // Refresh the list or update the state
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
            await axios.delete(`http://192.168.1.250:5000/api/students/${id}`);
            // Refresh the student list
            setStudents(students.filter(student => student._id !== id));
        } catch (error) {
            console.error('Error deleting student:', error);
            // Handle the error as needed
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="mt-2">
            <h2 className="mb-2">Student List</h2>
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
                    {students.map((student, index) => (
                        <tr key={student._id}>
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{student.regId}</td> {/* Registration number */}
                            <td>{new Date(student.date).toLocaleDateString()}</td>
                            <td><img className='w-100 h-100' src={`http://192.168.1.250:5000/api/images/${student.photo}`} target="_blank"/></td>
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
                            <td><a href={`/${student.marksheet}`} target="_blank" rel="noopener noreferrer">View</a></td>
                            <td><a href={`/${student.aadhaar}`} target="_blank" rel="noopener noreferrer">View</a></td>
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
