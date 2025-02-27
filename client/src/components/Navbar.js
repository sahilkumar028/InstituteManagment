import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ toggleDarkMode, darkMode, toggleSidebar }) => {
  const navigate = useNavigate();

  // Redirect to the PDFSplitter page when button is clicked
  const handlePrintBothSide = () => {
    navigate('/pdfsplitter');
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} fixed-top`}
      style={{ zIndex: 1050 }}
    >
      <div className="container-fluid">
        <button
          className="btn btn-outline-secondary d-lg-none me-3"
          onClick={toggleSidebar} // Toggle the sidebar on mobile
        >
          <i className="fas fa-bars"></i>
        </button>
        <Link className="navbar-brand" to="/">
          <img
            style={{ mixBlendMode: 'multiply' }}
            src="https://sahaskillinstitute.com/img/SI-logo.png"
            alt="Logo"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/EnquiryForm">Enquiry Form</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/AddStudents">Add Students</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ListStudents">List Students</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/IssuedCertificate">Issued Certificate</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/StudentTest">Student Test</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ListOfStudentTest">Student Test Records</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {/* Yellow button to redirect to PDFSplitter page */}
            <button
              className="btn btn-warning me-2"
              onClick={handlePrintBothSide}
            >
              Print Both Side
            </button>
            <button className="btn btn-primary" onClick={toggleDarkMode}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
