import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListResult.css';

const ListResult = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'registration', direction: 'asc' });

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/issued`);
            console.log('API Response:', response.data); // Debug log

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="list-result-container">
            <h2>Results List</h2>
            <div className="result-table-container">
                <table className="result-table">
                    <thead>
                        <tr>
                            <th onClick={() => sortResults('registration')} style={{ cursor: 'pointer' }}>
                                Registration {sortConfig.key === 'registration' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => sortResults('name')} style={{ cursor: 'pointer' }}>
                                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => sortResults('fathersname')} style={{ cursor: 'pointer' }}>
                                Father's Name {sortConfig.key === 'fathersname' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => sortResults('certificate')} style={{ cursor: 'pointer' }}>
                                Certificate {sortConfig.key === 'certificate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => sortResults('Grade')} style={{ cursor: 'pointer' }}>
                                Grade {sortConfig.key === 'Grade' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => sortResults('performance')} style={{ cursor: 'pointer' }}>
                                Performance {sortConfig.key === 'performance' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Issue Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results && results.length > 0 ? (
                            results.map((result) => (
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
        </div>
    );
};

export default ListResult; 