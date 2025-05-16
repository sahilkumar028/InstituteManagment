import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IssuedCertificateDownloads = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState({
        name: '',
        registration: '',
        course: ''
    });
    const [filteredCertificates, setFilteredCertificates] = useState([]);
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        // Fetch all certificates data
        const fetchCertificates = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API + '/api/issued');
                const certificatesData = Array.isArray(response.data.data) ? response.data.data : [];

                // Sort certificates by issue date (newest first)
                const sortedCertificates = certificatesData.sort((a, b) => {
                    // Create date objects from the issue date components
                    const dateA = new Date(a.issueDate || `${a.IssueYear}-${a.IssueMonth}-${a.IssueDay}`);
                    const dateB = new Date(b.issueDate || `${b.IssueYear}-${b.IssueMonth}-${b.IssueDay}`);
                    return dateB - dateA;
                });

                setCertificates(sortedCertificates);
                setFilteredCertificates(sortedCertificates);

                // Extract unique courses
                const uniqueCourses = [...new Set(sortedCertificates.map(cert => cert.certificate))].filter(Boolean);
                setCourses(uniqueCourses);
            } catch (error) {
                setError(error.message);
                setCertificates([]);
                setFilteredCertificates([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const handleDownload = (registration) => {
        window.open(`${process.env.REACT_APP_API}/api/createCertificate/${registration}`, '_blank');
    };

    const handleDelete = async (registration) => {
        if (window.confirm("Are you sure you want to delete this certificate?")) {
            try {
                await axios.delete(`${process.env.REACT_APP_API}/deletedata/registration/${registration}`);
                const updatedCertificates = certificates.filter((cert) => cert.registration !== registration);
                setCertificates(updatedCertificates);
                setFilteredCertificates(updatedCertificates);
                alert('Certificate deleted successfully!');
            } catch (error) {
                console.error('Error deleting certificate:', error);
                alert('Failed to delete the certificate.');
            }
        }
    };

    const handleSearch = (field, value) => {
        const newSearchQuery = {
            ...searchQuery,
            [field]: value
        };
        setSearchQuery(newSearchQuery);
        setCurrentPage(1); // Reset to first page on new search

        const filtered = certificates.filter(cert => {
            const nameMatch = cert.name.toLowerCase().includes(newSearchQuery.name.toLowerCase());
            const registrationMatch = cert.registration.toString().includes(newSearchQuery.registration);
            const courseMatch = newSearchQuery.course === '' || cert.certificate === newSearchQuery.course;

            return nameMatch && registrationMatch && courseMatch;
        });

        setFilteredCertificates(filtered);
    };

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCertificates.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="mt-2">
            <h2 className="mb-3">Issued Documents</h2>
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search by Name"
                    className="form-control border-start-0"
                    value={searchQuery.name}
                    onChange={(e) => handleSearch('name', e.target.value)}
                />
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search by Registration No"
                    className="form-control border-start-0"
                    value={searchQuery.registration}
                    onChange={(e) => handleSearch('registration', e.target.value)}
                />
            </div>
            <div className="mb-3">
                <select
                    className="form-select border-start-0"
                    value={searchQuery.course}
                    onChange={(e) => handleSearch('course', e.target.value)}
                >
                    <option value="">All Courses</option>
                    {courses.map((course, index) => (
                        <option key={index} value={course}>{course}</option>
                    ))}
                </select>
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
                    {filteredCertificates.map((student, index) => (
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
                                            onClick={() => handleDownload(student.registration)}
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
