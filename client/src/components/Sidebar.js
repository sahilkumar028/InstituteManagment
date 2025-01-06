// src/components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css'; // Import the custom CSS file

const Sidebar = ({ darkMode }) => {
  const location = useLocation();

  return (
    <>
      <div className={`sidebar-container ${darkMode ? 'sidebar-dark' : 'sidebar-light'}`}>
        <button
          className="btn btn-primary d-md-none mb-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-expanded="false"
          aria-controls="sidebarMenu"
        >
          Shows
        </button>
        
        <div className="collapse d-md-block sidebar-menu" id="sidebarMenu">
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
              <Link className={`nav-link ${location.pathname === '/StudentTest' ? 'active' : ''}`} to="/StudentTest">StudentTest</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/ListOfStudentTest' ? 'active' : ''}`} to="/ListOfStudentTest">Student Test Records</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
