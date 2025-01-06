import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IssuedCertificateDownloads = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    useEffect(() => {
        // Fetch issued documents data
        const fetchIssuedDocuments = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API + '/api/issued');
                // Sort students by registration number (newest first)
                const sortedStudents = response.data.sort((a, b) => b.registration - a.registration);
                setStudents(sortedStudents);
                setFilteredStudents(sortedStudents);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchIssuedDocuments();
    }, []);

    const handleDownload = (url, fileName) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
    };

    const handleDelete = async (registration) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await axios.delete(`http://192.168.1.250:5000/deletedata/registration/${registration}`);
                const updatedStudents = students.filter((student) => student.registration !== registration);
                setStudents(updatedStudents);
                setFilteredStudents(updatedStudents);
                alert('Record deleted successfully!');
            } catch (error) {
                console.error('Error deleting record:', error);
                alert('Failed to delete the record.');
            }
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredStudents(students);
        } else {
            const lowerCaseQuery = query.toLowerCase();
            const filtered = students.filter(
                (student) =>
                    student.registration.toString().includes(lowerCaseQuery) ||
                    student.name.toLowerCase().includes(lowerCaseQuery) ||
                    student.fathersname.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredStudents(filtered);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="mt-2">
            <h2 className="mb-3">Issued Documents</h2>
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search by Registration, Name, or Father's Name"
                    className="form-control"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>S. No.</th>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Registration No.</th>
                        <th>Father's Name</th>
                        <th>Mother's Name</th>
                        <th>Date of Birth</th>
                        <th>Performance</th>
                        <th>Grade</th>
                        <th>Duration</th>
                        <th>Issued Documents</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((student, index) => (
                        <tr key={student._id.$oid}>
                            <td>{index + 1}</td>
                            <td>
                                <img
                                    src={student.photo}
                                    alt={student.name}
                                    style={{ width: '50px', height: '50px' }}
                                />
                            </td>
                            <td>{student.name}</td>
                            <td>{student.registration}</td>
                            <td>{student.fathersname}</td>
                            <td>{student.mothersname}</td>
                            <td>{new Date(student.dob).toLocaleDateString()}</td>
                            <td>{student.performance}</td>
                            <td>{student.Grade}</td>
                            <td>{student.duration}</td>
                            <td>
                                <div className="d-flex flex-column">
                                    {student.certificate && (
                                        <button
                                            className="btn btn-primary btn-sm mb-2"
                                            onClick={() =>
                                                handleDownload(
                                                    `http://192.168.1.250:5000/createCertificate/${student.registration}`,
                                                    `${student.name}-Certificate.pdf`
                                                )
                                            }
                                        >
                                            Download Certificate
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(student.registration)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IssuedCertificateDownloads;
