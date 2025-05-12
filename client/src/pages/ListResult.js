import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListResult.css';

const ListResult = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/results`);
            setResults(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching results');
            setLoading(false);
        }
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
                            <th>Registration</th>
                            <th>Name</th>
                            <th>Father's Name</th>
                            <th>Course</th>
                            <th>Grade</th>
                            <th>Performance</th>
                            <th>Issue Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result) => (
                            <tr key={result._id}>
                                <td>{result.registration}</td>
                                <td>{result.name}</td>
                                <td>{result.fathersname}</td>
                                <td>{result.course}</td>
                                <td>{result.Grade}</td>
                                <td>{result.performance}</td>
                                <td>{`${result.IssueDay}/${result.IssueMonth}/${result.IssueYear}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListResult; 