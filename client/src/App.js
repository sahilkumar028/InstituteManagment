import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudents';
import ListStudents from './pages/ListStudents';
import IDCard from './pages/IDCard';
import IssuedCertificateDownloads from './pages/IssuedCertificateDownload';
import IssuedCertificate from './pages/IssuedCertificate';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import './index.css'; // Custom CSS for theme colors
import Login from './components/Login';
import EnquiryForm from './pages/EnquiryForm';
import StudentTest from './pages/StudentTest';
import Tally from './pages/Tally';
import ListOfStudentTest from './pages/ListOfStudentTest';
import TestCheck from './pages/TestCheck';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to control sidebar visibility

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle sidebar visibility
  };

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} toggleSidebar={toggleSidebar} />
      <div
        className={`d-flex ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}
        style={{ minHeight: '100vh', paddingTop: '56px' }} // Adjust for fixed Navbar height
      >
        {/* Sidebar: visible on larger screens or when toggled open */}
        {sidebarOpen && (
          <Sidebar darkMode={darkMode} />
        )}

        {/* Main content area */}
        <main
          className={`flex-grow-1 p-3 ${!sidebarOpen ? '' : 'ms-lg-250'}`}
          style={!sidebarOpen ? { marginLeft: 0 } : { marginLeft: '250px' }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/AddStudents" element={<AddStudent />} />
            <Route path="/StudentTest" element={<StudentTest />} />
            <Route path="/StudentTest/Tally" element={<Tally />} />
            <Route path="/ListOfStudentTest" element={<ListOfStudentTest />} />
            <Route path="/EnquiryForm" element={<EnquiryForm />} />
            <Route path="/ListStudents" element={<ListStudents />} />
            <Route path="/IssuedCertificate" element={<IssuedCertificateDownloads />} />
            <Route path="/issued/:id" element={<IssuedCertificate />} />
            <Route path="/idcard/:id" element={<IDCard />} />
            <Route path="/TestCheck/:id" element={<TestCheck />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
