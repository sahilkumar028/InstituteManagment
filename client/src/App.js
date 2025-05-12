import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudents';
import ListStudents from './pages/ListStudents';
import UpdateStudent from './pages/UpdateStudents';
import IDCard from './pages/IDCard';
import IssuedCertificateDownloads from './pages/IssuedCertificateDownload';
import IssuedCertificate from './pages/IssuedCertificate';
import EnquiryForm from './pages/EnquiryForm';
import StudentTest from './pages/StudentTest';
import Tally from './pages/Tally';
import ListOfStudentTest from './pages/ListOfStudentTest';
import PDFSplitter from './pages/PDFSplitter';
import TestCheck from './pages/TestCheck';
import FeesPayment from './pages/FeesPayment';
import PaymentSlipDesigner from './components/PaymentSlipDesigner';
import ListEnquiry from './pages/ListEnquiry';
import AddEnquiry from './pages/AddEnquiry';
import ListResult from './pages/ListResult';
import AddResult from './pages/AddResult';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const expiryTime = localStorage.getItem('expiryTime');

  if (!isAuthenticated || (expiryTime && Date.now() > expiryTime)) {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('expiryTime');
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const expiryTime = localStorage.getItem('expiryTime');
    if (expiryTime && Date.now() > expiryTime) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('expiryTime');
      window.location.href = '/login';
    }
  }, []);

  return (
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className={darkMode ? 'dark-mode' : 'light-mode'}>
                <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} toggleSidebar={toggleSidebar} />
                <div className={`d-flex ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`} style={{ minHeight: '100vh', paddingTop: '56px' }}>
                  {sidebarOpen && <Sidebar darkMode={darkMode} />}
                  <main className={`flex-grow-1 p-3 overflow-scroll ${!sidebarOpen ? '' : 'ms-lg-250'}`} style={!sidebarOpen ? { marginLeft: 0 } : { marginLeft: '250px' }}>
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
                      <Route path="/update/:id" element={<UpdateStudent />} />
                      <Route path="/TestCheck/:id" element={<TestCheck />} />
                      <Route path="/PDFSplitter" element={<PDFSplitter />} />
                      <Route path="/FeesPayment" element={<FeesPayment />} />
                      <Route path="/PaymentSlipDesigner" element={<PaymentSlipDesigner />} />
                      <Route path="/ListEnquiry" element={<ListEnquiry />} />
                      <Route path="/AddEnquiry" element={<AddEnquiry />} />
                      <Route path="/ListResult" element={<ListResult />} />
                      <Route path="/AddResult" element={<AddResult />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
  );
};

export default App;
