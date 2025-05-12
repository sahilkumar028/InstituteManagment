import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListEnquiry.css';

const ListEnquiry = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/enquiries`);
            setEnquiries(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching enquiries');
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="list-enquiry-container">
            <h2>Enquiries List</h2>
            <div className="enquiry-table-container">
                <table className="enquiry-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Course</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enquiries.map((enquiry) => (
                            <tr key={enquiry._id}>
                                <td>{new Date(enquiry.date).toLocaleDateString()}</td>
                                <td>{enquiry.name}</td>
                                <td>{enquiry.phone}</td>
                                <td>{enquiry.course}</td>
                                <td>{enquiry.remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListEnquiry; 