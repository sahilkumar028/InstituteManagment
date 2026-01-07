import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './IssuedCertificateDownload.css';

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
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API + '/api/issued');
            const certificatesData = Array.isArray(response.data.data) ? response.data.data : [];

            // Sort certificates by issue date (newest first)
            const sortedCertificates = certificatesData.sort((a, b) => {
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

    const handleDownload = (enrollno) => {
        window.open(`${process.env.REACT_APP_API}/api/createCertificate/${enrollno}`, '_blank');
    };

    const handleDelete = async (enrollno) => {
        if (window.confirm("Are you sure you want to delete this certificate?")) {
            try {
                await axios.delete(`${process.env.REACT_APP_API}/api/issued/${enrollno}`);
                const updatedCertificates = certificates.filter((cert) => cert.enrollno !== enrollno);
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

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="certificate-container">
            <h2 className="page-title">Issued Documents</h2>
            
            {/* Search Section */}
            <div className="search-section">
                <div className="search-group">
                    <input
                        type="text"
                        placeholder="Search by Name"
                        className="search-input"
                        value={searchQuery.name}
                        onChange={(e) => handleSearch('name', e.target.value)}
                    />
                </div>
                <div className="search-group">
                    <input
                        type="text"
                        placeholder="Search by Registration No"
                        className="search-input"
                        value={searchQuery.registration}
                        onChange={(e) => handleSearch('registration', e.target.value)}
                    />
                </div>
                <div className="search-group">
                    <select
                        className="search-select"
                        value={searchQuery.course}
                        onChange={(e) => handleSearch('course', e.target.value)}
                    >
                        <option value="">All Courses</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course}>{course}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div className="table-container">
                <table className="certificate-table">
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
                        {currentItems.map((student, index) => (
                            <tr key={student._id}>
                                <td>{indexOfFirstItem + index + 1}</td>
                                <td>
                                    <img
                                        src={student.photo}
                                        alt={student.name}
                                        className="student-photo"
                                    />
                                </td>
                                <td>{student.name}</td>
                                <td>{student.registration}</td>
                                <td>{student.erollno}</td>
                                <td>{student.fathersname}</td>
                                <td>{student.mothersname}</td>
                                <td>{new Date(student.dob).toLocaleDateString()}</td>
                                <td>{student.performance}</td>
                                <td>{student.Grade}</td>
                                <td>{student.duration}</td>
                                <td>
                                    <div className="action-buttons">
                                        {student.certificate && (
                                            <button
                                                className="btn-download"
                                                onClick={() => handleDownload(student.erollno)}
                                            >
                                                Download Certificate
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(student.erollno)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(page)}
                                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                >
                                    {page}
                                </button>
                            );
                        }
                        if (page === 2 || page === totalPages - 1) {
                            return (
                                <button
                                    key={index}
                                    className="pagination-btn disabled"
                                    disabled
                                >
                                    ...
                                </button>
                            );
                        }
                        return null;
                    })}

                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default IssuedCertificateDownloads;
