// src/components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css'; // Import the custom CSS file

const Sidebar = ({ darkMode }) => {
  const location = useLocation();

  return (
    <>
      <div className={`sidebar-container ${darkMode ? 'sidebar-dark' : 'sidebar-light'}`}>
        {/* Toggle button for mobile */}
        <button
          className="btn btn-primary d-md-none mb-3"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasSidebar"
          aria-controls="offcanvasSidebar"
        >
          ___
        </button>

        {/* Off-canvas sidebar for mobile */}
        <div
          className="offcanvas offcanvas-start"
          id="offcanvasSidebar"
          aria-labelledby="offcanvasSidebarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasSidebarLabel">Menu</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/EnquiryForm' ? 'active' : ''}`} to="/EnquiryForm">Enquiry Form</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/AddStudents' ? 'active' : ''}`} to="/AddStudents">Add Students</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/ListStudents' ? 'active' : ''}`} to="/ListStudents">List Students</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/IssuedCertificate' ? 'active' : ''}`} to="/IssuedCertificate">Issued Certificate</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/StudentTest' ? 'active' : ''}`} to="/StudentTest">Student Test</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/ListOfStudentTest' ? 'active' : ''}`} to="/ListOfStudentTest">Student Test Records</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/FeesPayment' ? 'active' : ''}`} to="/FeesPayment">Fees Payment</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar for desktop */}
        <div className="d-none d-md-block sidebar-menu">
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/EnquiryForm' ? 'active' : ''}`} to="/EnquiryForm">Enquiry Form</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/AddStudents' ? 'active' : ''}`} to="/AddStudents">Add Students</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/ListStudents' ? 'active' : ''}`} to="/ListStudents">List Students</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/IssuedCertificate' ? 'active' : ''}`} to="/IssuedCertificate">Issued Certificate</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/StudentTest' ? 'active' : ''}`} to="/StudentTest">Student Test</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/ListOfStudentTest' ? 'active' : ''}`} to="/ListOfStudentTest">Student Test Records</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/FeesPayment' ? 'active' : ''}`} to="/FeesPayment">Fees Payment</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
