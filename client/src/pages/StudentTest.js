import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';

const StudentTest = () => {
  const buttonStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '150px',
    height: '150px',
    margin: '15px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px',
    transition: 'all 0.2s',
    textAlign: 'center',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#e9ecef',
    transform: 'scale(1.05)',
  };

  const buttons = [
    {
      icon: <FaUserPlus size={50} />,
      link: '/StudentTest/Tally',
      label: 'Tally',
      image: 'https://tallysolutions.com/wp-content/uploads/2020/10/tally-prime-logo.svg', // Replace with actual image URLs
    },
    {
      icon: <FaUserPlus size={50} />,
      link: '/StudentTest/Word',
      label: 'Ms Word',
      image: 'https://logodownload.org/wp-content/uploads/2018/10/word-logo-0.png', // Replace with actual image URLs
    },
    {
      icon: <FaUserPlus size={50} />,
      link: '/StudentTest/Excel',
      label: 'Ms Excel',
      image: 'https://logodownload.org/wp-content/uploads/2020/04/excel-logo-0.png', // Replace with actual image URLs
    },
    {
      icon: <FaUserPlus size={50} />,
      link: '/StudentTest/FundamentalInternet',
      label: 'Fundamental + Internet',
      image: 'https://www.pngall.com/wp-content/uploads/8/Internet-PNG-Picture.png', // Replace with actual image URLs
    },
    {
      icon: <FaUserPlus size={50} />,
      link: '/StudentTest/Powerpoint',
      label: 'Ms Powerpoint',
      image: 'https://logodownload.org/wp-content/uploads/2020/04/microsoft-powerpoint-logo-0-2048x2048.png', // Replace with actual image URLs
    },
    {
      icon: <FaUserPlus size={50} />,
      link: '/StudentTest/Access',
      label: 'Ms Access',
      image: 'https://logodownload.org/wp-content/uploads/2021/08/microsoft-access-logo-0.png', // Replace with actual image URLs
    },
  ];

  return (
    <div>
      <h1 className="mb-4">Student Tests</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {buttons.map((button, index) => (
          <Link
            to={button.link}
            key={index}
            style={buttonStyle}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
            title={button.label}
          >
            <img
              src={button.image}
              alt={button.label}
              style={{ width: '100px', height: '100px', marginBottom: '10px' }}
            />
            <div>{button.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StudentTest;
