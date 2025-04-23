import React, { useState } from 'react';
import axios from 'axios';

const PDFSplitter = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setError(null);
        } else {
            setError('Please select a valid PDF file');
            setSelectedFile(null);
        }
    };

    const handleSplit = async (side) => {
        if (!selectedFile) {
            setError('Please select a PDF file first');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('pdf', selectedFile);

            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/pdf/split/${side}`,
                formData,
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Create a blob from the PDF data
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Open PDF in new tab
            window.open(url, '_blank');
            
            // Clean up
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error splitting PDF:', error);
            setError('Error splitting PDF. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-center">PDF Splitter</h3>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="pdfFile" className="form-label">
                                    Select PDF File
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="pdfFile"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleSplit('odd')}
                                    disabled={!selectedFile || loading}
                                >
                                    {loading ? 'Processing...' : 'Split Odd Pages'}
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleSplit('even')}
                                    disabled={!selectedFile || loading}
                                >
                                    {loading ? 'Processing...' : 'Split Even Pages'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFSplitter; 