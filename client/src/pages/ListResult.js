import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListResult.css';

const ListResult = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'registration', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/issued`);
            console.log('API Response:', response.data);

            if (response.data && response.data.success && Array.isArray(response.data.data)) {
                setResults(response.data.data);
            } else {
                console.log('Invalid response format:', response.data);
                setResults([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching results:', error);
            setError('Error fetching results');
            setLoading(false);
        }
    };

    const sortResults = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedResults = [...results].sort((a, b) => {
            if (!a[key] || !b[key]) return 0;
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setResults(sortedResults);
    };

    // Pagination logic
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
    const totalPages = Math.ceil(results.length / resultsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="list-result-container">
            <h2>Results List</h2>
            <div className="result-table-container">
                <table className="result-table">
                    <thead>
                        <tr>
                            <th onClick={() => sortResults('registration')}>
                                Registration {sortConfig.key === 'registration' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => sortResults('name')}>
                                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => sortResults('fathersname')}>
                                Father's Name {sortConfig.key === 'fathersname' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => sortResults('certificate')}>
                                Certificate {sortConfig.key === 'certificate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => sortResults('Grade')}>
                                Grade {sortConfig.key === 'Grade' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => sortResults('performance')}>
                                Performance {sortConfig.key === 'performance' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Issue Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentResults && currentResults.length > 0 ? (
                            currentResults.map((result) => (
                                <tr key={result._id}>
                                    <td>{result.registration}</td>
                                    <td>{result.name}</td>
                                    <td>{result.fathersname}</td>
                                    <td>{result.certificate}</td>
                                    <td>{result.Grade}</td>
                                    <td>{result.performance}</td>
                                    <td>{`${result.IssueDay}/${result.IssueMonth}/${result.IssueYear}`}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>No results found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="btn btn-secondary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        // Show first page, last page, and pages around current page
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(page)}
                                    className={`btn ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                                >
                                    {page}
                                </button>
                            );
                        }
                        // Show ellipsis for skipped pages
                        if (page === 2 || page === totalPages - 1) {
                            return (
                                <button
                                    key={index}
                                    className="btn btn-secondary"
                                    disabled
                                >
                                    ...
                                </button>
                            );
                        }
                        return null;
                    })}

                    <button
                        className="btn btn-secondary"
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

export default ListResult; 