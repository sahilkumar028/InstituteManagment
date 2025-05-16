import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaFileExcel } from 'react-icons/fa';

const ListStudents = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleDownloadExcel = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API}/api/students/download-excel`, {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            });
            
            // Create a blob from the response data
            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.download = `students-list-${new Date().toISOString().split('T')[0]}.xlsx`;
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the URL
            window.URL.revokeObjectURL(url);
            setLoading(false);
        } catch (error) {
            console.error('Error downloading Excel:', error);
            setError('Error downloading Excel file. Please try again.');
            setLoading(false);
            alert('Error downloading Excel file. Please try again.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Students List</h2>
                <div>
                    <button 
                        className="btn btn-success me-2"
                        onClick={handleDownloadExcel}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Downloading...
                            </>
                        ) : (
                            <>
                                <FaFileExcel className="me-2" />
                                Download Excel
                            </>
                        )}
                    </button>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/add-student')}
                    >
                        Add New Student
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* ... rest of the component ... */}
        </div>
    );
};

export default ListStudents; 