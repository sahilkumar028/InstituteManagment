import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListOfStudent = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch students from API
        const fetchStudents = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API+'/api/studentTests');
                setStudents(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // const handleComplete = async (id) => {
    //     try {
    //         await axios.put(`${process.env.REACT_APP_API}/api/students/${id}/complete`);
    //         // Refresh the list or update the state
    //         setStudents(students.map(student =>
    //             student._id === id ? { ...student, courseStatus: 'Complete' } : student
    //         ));
    //         alert('Course status updated to Complete');
    //     } catch (error) {
    //         console.error('Failed to update course status:', error);
    //     }
    // };

    const handleTestCheck = (id) => {
        navigate(`/TestCheck/${id}`);
    };
    const handleView = (id) => {
        navigate(`/viewTest/${id}`);
    };

    

    // const handleIssued = (student) => {
    //     console.log('Issuing student:', student);
    //     navigate(`/issued/${student._id}`, { state: { student } });
    // };

    // const handleDelete = async (id) => {
    //     try {
    //         await axios.delete(`${process.env.REACT_APP_API}/api/studentTest`);
    //         // Refresh the student list
    //         setStudents(students.filter(student => student._id !== id));
    //     } catch (error) {
    //         console.error('Error deleting student:', error);
    //         // Handle the error as needed
    //     }
    // };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="mt-2">
            <h2 className="mb-2">Student Test List</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>S. No.</th>
                        <th>Name</th>
                        <th>BatchTime</th>
                        <th>Teacher's Name </th>
                        <th>Marks</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student._id}>
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{student.name}</td>
                            <td>{student.batchTime}</td>
                            <td>{student.teacherName}</td>
                            <td>{student.marks}</td>
                            <td>
                                <button onClick={() => handleTestCheck(student._id)} className="btn text-primary btn-sm me-4 w-100">
                                    <i className="fas fa-id-card"></i> Test Check
                                </button>
                                <button onClick={() => handleView(student._id)} className="btn text-warning btn-sm me-4 w-100">
                                    <i className="fas fa-edit"></i> View
                                 </button>
                                {/*<button onClick={() => handleComplete(student._id)} className="btn text-success btn-sm me-4 w-100">
                                    <i className="fas fa-check-circle"></i> Complete
                                </button>
                                <button onClick={() => handleIssued(student)} className="btn text-info btn-sm me-4 w-100">
                                    <i className="fas fa-check-square"></i> Issued
                                </button>
                                <button onClick={() => handleDelete(student._id)} className="btn text-danger btn-sm me-4 w-100">
                                    <i className="fas fa-trash"></i> Delete
                                </button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListOfStudent;
