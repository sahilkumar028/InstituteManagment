import React, { useState, useEffect } from 'react';
import {
  FaUserPlus,
  FaListAlt,
  FaCertificate,
  FaIdCard,
  FaSearch,
  FaTasks,
  FaFilter,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Row, Col, Card, Dropdown } from 'react-bootstrap';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [chartData, setChartData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [feesData, setFeesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [courseFilter, setCourseFilter] = useState('all');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  // Fetch all chart data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch student count data
      const studentResponse = await axios.get(`${process.env.REACT_APP_API}/api/student-data/${timeFilter}`);
      
      // Fetch course-wise data
      const courseResponse = await axios.get(`${process.env.REACT_APP_API}/api/student-data/courses`);
      
      // Fetch fees data
      const feesResponse = await axios.get(`${process.env.REACT_APP_API}/api/student-data/fees/${timeFilter}`);

      // Transform student count data
      setChartData({
        labels: studentResponse.data.map((item) => item.month),
        datasets: [{
          label: 'Student Count',
          data: studentResponse.data.map((item) => item.count),
          fill: false,
          borderColor: '#4c8bf5',
          tension: 0.1,
          pointBackgroundColor: '#4c8bf5',
        }],
      });

      // Transform course data
      setCourseData({
        labels: courseResponse.data.map((item) => item.course),
        datasets: [{
          data: courseResponse.data.map((item) => item.count),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
        }],
      });

      // Transform fees data
      setFeesData({
        labels: feesResponse.data.map((item) => item.month),
        datasets: [{
          label: 'Total Fees',
          data: feesResponse.data.map((item) => item.amount),
          backgroundColor: '#4c8bf5',
        }],
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
      setLoading(false);
    }
  };

  // Fetch data when component mounts or timeFilter changes
  useEffect(() => {
    fetchAllData();
  }, [timeFilter]);

  const buttonStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '120px',
    height: '120px',
    margin: '10px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#333',
    fontSize: '24px',
    transition: 'all 0.3s ease',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#f8f9fa',
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  };

  const buttons = [
    { icon: <FaUserPlus />, link: '/AddStudents', label: 'Add Students' },
    { icon: <FaListAlt />, link: '/ListStudents', label: 'List Students' },
    { icon: <FaCertificate />, link: '/IssuedCertificate', label: 'Certificates' },
    { icon: <FaIdCard />, action: handleOpenModal, label: 'Generate ID Card' },
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

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const barOptions = {
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
          text: 'Total Fees (₹)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-center">Dashboard</h1>
      
      {/* Quick Access Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
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
              <span style={{ fontSize: '14px', marginTop: '8px' }}>{button.label}</span>
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
              <span style={{ fontSize: '14px', marginTop: '8px' }}>{button.label}</span>
            </div>
          )
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Charts Section */}
      <Row className="g-4">
        {/* Student Count Chart */}
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Student Count</h5>
              <Dropdown>
                <Dropdown.Toggle variant="light" size="sm">
                  <FaFilter /> {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setTimeFilter('monthly')}>Monthly</Dropdown.Item>
                  <Dropdown.Item onClick={() => setTimeFilter('quarterly')}>Quarterly</Dropdown.Item>
                  <Dropdown.Item onClick={() => setTimeFilter('yearly')}>Yearly</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : chartData ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <p className="text-center text-muted">No data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Course Distribution Chart */}
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Course Distribution</h5>
              <Dropdown>
                <Dropdown.Toggle variant="light" size="sm">
                  <FaFilter /> {courseFilter === 'all' ? 'All Courses' : courseFilter}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setCourseFilter('all')}>All Courses</Dropdown.Item>
                  <Dropdown.Item onClick={() => setCourseFilter('active')}>Active Courses</Dropdown.Item>
                  <Dropdown.Item onClick={() => setCourseFilter('completed')}>Completed Courses</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : courseData ? (
                <Pie data={courseData} options={pieOptions} />
              ) : (
                <p className="text-center text-muted">No data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Fees Chart */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Student Fees</h5>
              <Dropdown>
                <Dropdown.Toggle variant="light" size="sm">
                  <FaFilter /> {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setTimeFilter('monthly')}>Monthly</Dropdown.Item>
                  <Dropdown.Item onClick={() => setTimeFilter('quarterly')}>Quarterly</Dropdown.Item>
                  <Dropdown.Item onClick={() => setTimeFilter('yearly')}>Yearly</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : feesData ? (
                <Bar data={feesData} options={barOptions} />
              ) : (
                <p className="text-center text-muted">No data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ID Card Modal */}
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
