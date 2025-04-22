import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaPrint, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('expiryTime');
    navigate('/login');
  };

  // Redirect to PDF Splitter
  const handlePrintBothSide = () => {
    navigate('/pdfsplitter');
  };

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} fixed-top`} style={{ zIndex: 1050 }}>
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link className="navbar-brand" to="/">
          <img style={{ mixBlendMode: 'multiply', height: '40px' }} src="https://sahaskillinstitute.com/img/SI-logo.png" alt="Logo" />
        </Link>

        {/* Navbar Toggler (for small screens) */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/EnquiryForm">Enquiry</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/AddStudents">Add Students</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/ListStudents">List Students</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/IssuedCertificate">Certificates</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/StudentTest">Student Test</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/ListOfStudentTest">Test Records</Link></li>
          </ul>

          {/* Icon Buttons (No Labels) */}
          <div className="d-flex">
            <button className="btn btn-warning me-2" onClick={handlePrintBothSide} title="Print Both Side">
              <FaPrint size={20} />
            </button>
            <button className="btn btn-primary me-2" onClick={toggleDarkMode} title="Toggle Dark Mode">
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <button className="btn btn-danger" onClick={handleLogout} title="Logout">
              <FaSignOutAlt size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
