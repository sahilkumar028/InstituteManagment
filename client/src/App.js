// src/App.js
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard'; // Or other pages
import AddStudent from './pages/AddStudents'; // Or other pages
import ListStudents from './pages/ListStudents'; // Or other components
import IDCard from './pages/IDCard'; // Or other components
import IssuedCertificate from './pages/IssuedCertificate'; // Or other components
import Navbar from './components/Navbar'; // Or other components
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import './index.css'; // Custom CSS for theme colors

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <div className={`d-flex ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>

        <Sidebar darkMode={darkMode} />
        <main className="flex-grow-1 p-3 overflow-scroll">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/AddStudents" element={<AddStudent />} />
            <Route path="/ListStudents" element={<ListStudents />} />
            <Route path="/issued/:id" element={<IssuedCertificate />} />
            <Route path="/idcard/:id" element={<IDCard />} />
            {/* Add your other routes here */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
