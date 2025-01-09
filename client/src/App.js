// src/App.js
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard'; // Or other pages
import AddStudent from './pages/AddStudents'; // Or other pages
import ListStudents from './pages/ListStudents'; // Or other components
import IDCard from './pages/IDCard'; // Or other components
import IssuedCertificateDownloads from './pages/IssuedCertificateDownload'; // Or other components
import IssuedCertificate from './pages/IssuedCertificate'; // Or other components
import Navbar from './components/Navbar'; // Or other components
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import './index.css'; // Custom CSS for theme colors
import Login from './components/Login';
import EnquiryForm from './pages/EnquiryForm';
import StudentTest from './pages/StudentTest';
import ListOfStudentTest from './pages/ListOfStudentTest';
import TestCheck from './pages/TestCheck';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'} className='h-100'>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <div className={`d-flex ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>

        <Sidebar darkMode={darkMode} />
        <main className="flex-grow-1 p-3 overflow-scroll">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/AddStudents" element={<AddStudent />} />
            <Route path="/StudentTest" element={<StudentTest />} />
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
      {/* <Login /> */}
    </div>
  );
};

export default App;      

// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// const Dashboard = () => {
//   const handleLogin = (role) => {
//     alert(`Navigating to ${role} portal`);
//     // Redirect logic, e.g., window.location.href = `/portal/${role.toLowerCase()}`;
//   };

//   return (
//     <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="row text-center">
//         {/* Student Box */}
//         <div className="col-md-6 col-sm-12 mb-4">
//           <div
//             className="card p-4 shadow rounded"
//             style={{ width: "150px", height: "150px", cursor: "pointer" }}
//             onClick={() => handleLogin("Student")}
//           >
//             <div className="card-body d-flex flex-column justify-content-center align-items-center">
//               <i className="fas fa-users fa-2x mb-3"></i> {/* Multiple User Icon */}
//               <p className="h5 m-0">Student</p>
//             </div>
//           </div>
//         </div>

//         {/* Admin Box */}
//         <div className="col-md-6 col-sm-12 mb-4">
//           <div
//             className="card p-4 shadow rounded"
//             style={{ width: "150px", height: "150px", cursor: "pointer" }}
//             onClick={() => handleLogin("Admin")}
//           >
//             <div className="card-body d-flex flex-column justify-content-center align-items-center">
//               <i className="fas fa-user fa-2x mb-3"></i> {/* Single User Icon */}
//               <p className="h5 m-0">Admin</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

