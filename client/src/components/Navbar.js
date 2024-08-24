// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleDarkMode, darkMode }) => {
  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Dashboard</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/AddStudents">AddStudents</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ListStudents">ListStudents</Link>
            </li>
          </ul>
          <button className="btn btn-primary" onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
