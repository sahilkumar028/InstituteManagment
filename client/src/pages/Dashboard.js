import React, { useState, useEffect } from 'react';
import {
  FaUserPlus,
  FaListAlt,
  FaCertificate,
  FaIdCard,
  FaSearch,
  FaTasks,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [enrollmentNo, setEnrollmentNo] = useState(''); // Enrollment number state
  const [chartData, setChartData] = useState(null); // State for chart data
  const [loading, setLoading] = useState(true); // Loading state for API call
  const navigate = useNavigate(); // React Router navigation

  // Modal controls
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (enrollmentNo.trim()) {
      navigate(`/idcard/${enrollmentNo}`);
      handleCloseModal();
    } else {
      alert('Please enter a valid enrollment number.');
    }
  };

  // Fetch data for the chart
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API+'/student-data/monthly'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }
        const data = await response.json();

        // Transform the data into a format suitable for Chart.js
        const labels = data.map((item) => item.month); // Example: ['January', 'February', ...]
        const counts = data.map((item) => item.count); // Example: [50, 75, ...]

        setChartData({
          labels,
          datasets: [
            {
              label: 'Student Count',
              data: counts,
              fill: false,
              borderColor: '#4c8bf5',
              tension: 0.1,
              pointBackgroundColor: '#4c8bf5',
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const buttonStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100px',
    height: '100px',
    margin: '10px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#333',
    fontSize: '24px',
    transition: 'all 0.2s',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#e9ecef',
    transform: 'scale(1.05)',
  };

  const buttons = [
    { icon: <FaUserPlus />, link: '/AddStudents', label: 'Add Students' },
    { icon: <FaListAlt />, link: '/ListStudents', label: 'List Students' },
    { icon: <FaCertificate />, link: '/IssuedCertificate', label: 'Certificates' },
    {
      icon: <FaIdCard />,
      action: handleOpenModal,
      label: 'Generate ID Card',
    },
    { icon: <FaSearch />, link: '/EnquiryForm', label: 'Enquiry' },
    { icon: <FaTasks />, link: '/StudentTest', label: 'Student Tests' },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Student Count',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {buttons.map((button, index) =>
          button.link ? (
            <Link
              to={button.link}
              key={index}
              style={buttonStyle}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
              title={button.label}
            >
              {button.icon}
            </Link>
          ) : (
            <div
              key={index}
              style={buttonStyle}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
              onClick={button.action}
              title={button.label}
            >
              {button.icon}
            </div>
          )
        )}
      </div>

      <div className="mt-5 w-50">
        <h2>Student Count (Month-wise)</h2>

        {loading ? (
          <p>Loading chart...</p>
        ) : chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p>Failed to load chart data.</p>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Generate ID Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="enrollmentNo">
              <Form.Label>Enter Enrollment Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter enrollment number"
                value={enrollmentNo}
                onChange={(e) => setEnrollmentNo(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Generate ID Card
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
