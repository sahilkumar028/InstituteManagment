import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

const PDFSplitter = () => {
  const [file, setFile] = useState(null);
  const [splitType, setSplitType] = useState('odd');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  // API base URL from environment variable
  const API_BASE_URL = process.env.REACT_APP_API;

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    // Clear previous PDF display when a new file is chosen
    setPdfUrl('');
  };

  // Handle splitting the PDF and displaying it inline
  const handleSplit = async () => {
    if (!file) {
      alert('Please select a PDF file.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    // Build the correct endpoint using the split type
    const endpoint =
      splitType === 'odd'
        ? `${API_BASE_URL}/split/odd`
        : `${API_BASE_URL}/split/even`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error splitting PDF');
      }

      // Get the PDF blob from the response
      const blob = await response.blob();
      // Create a URL for the blob to display in an iframe
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error splitting PDF:', error);
      alert('There was an error processing your PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white text-center">
          <h3>PDF Splitter</h3>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="pdfInput">
              <Form.Label>Upload PDF</Form.Label>
              <Form.Control
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Choose Split Type:</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  id="oddPages"
                  label="Frontside"
                  value="odd"
                  checked={splitType === 'odd'}
                  onChange={() => setSplitType('odd')}
                />
                <Form.Check
                  inline
                  type="radio"
                  id="evenPages"
                  label="Backside"
                  value="even"
                  checked={splitType === 'even'}
                  onChange={() => setSplitType('even')}
                />
              </div>
            </Form.Group>
            <Button
              variant="success"
              className="w-100"
              onClick={handleSplit}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Split PDF'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      {pdfUrl && (
        <div className="mt-4">
          <h4>Resulting PDF:</h4>
          <iframe
            src={pdfUrl}
            title="Processed PDF"
            style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
          />
        </div>
      )}
    </Container>
  );
};

export default PDFSplitter;
