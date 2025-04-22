import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateStudent = () => {
  const [studentData, setStudentData] = useState({
    date: '',
    name: '',
    fatherName: '',
    motherName: '',
    dob: '',
    age: '',
    email: '',
    phone: '',
    address: '',
    course: '',
    fees: '',
    duration: '',
    durationOption: '',
    photo: null,
    marksheet: null,
    aadhaar: null,
    reference: ''
  });

  const { id } = useParams();
  const [registrationId, setRegistrationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const courses = [
    { name: 'Office Automation', fee: 3600, duration: 3 },
    { name: 'Diploma in Computer Application and Accounting', fee: 7200, duration: 6 },
    { name: 'Advance Diploma in Computer Application', fee: 14400, duration: 12 },
    { name: 'Advance Excel', fee: 2500, duration: 2 },
    { name: 'Tally/Tally Prime', fee: 4000, duration: 2 },
    { name: 'Auto CAD', fee: 5000, duration: 3 },
    { name: 'Web designing ', fee: 8500, duration: 6 },
    { name: 'Web Development using MERN', fee: 18000, duration: 14 },
    { name: 'Web Development using Java Springboot', fee: 18000, duration: 14 },
    { name: 'C Language', fee: 3500, duration: 4 },
    { name: 'C++ Language', fee: 3500, duration: 4 },
    { name: 'Core Java', fee: 5000, duration: 6 },
    { name: 'Advance Java', fee: 7000, duration: 6 },
    { name: 'Python', fee: 6000, duration: 6 },
    { name: 'Data Structure and Algorithms', fee: 6000, duration: 6 },
    { name: 'Spoken', fee: 1500, duration: 1 },
    { name: 'Certificate Courses', fee: 2500, duration: 1 }
  ];

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/students/${id}`);
        setStudentData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  useEffect(() => {
    const today = new Date();
    const sixMonthsBack = new Date(today);
    sixMonthsBack.setMonth(today.getMonth() - 6);
    const formattedToday = today.toISOString().split('T')[0];
    const formattedSixMonthsBack = sixMonthsBack.toISOString().split('T')[0];
    setStudentData(prevData => ({
      ...prevData,
      date: formattedToday,
    }));
    const dateInput = document.getElementById('date');
    if (dateInput) {
      dateInput.setAttribute('min', formattedSixMonthsBack);
      dateInput.setAttribute('max', formattedToday);
    }
  }, []);

  useEffect(() => {
    const selectedCourse = courses.find(course => course.name === studentData.course);
    if (selectedCourse) {
      let adjustedDuration = selectedCourse.duration;
      if (studentData.durationOption === '2 hours') {
        if (selectedCourse.duration > 1) {
          adjustedDuration = selectedCourse.duration / 2;
        }
      }
      setStudentData(prevData => ({
        ...prevData,
        fees: selectedCourse.fee,
        duration: `${adjustedDuration} ${adjustedDuration > 1 ? 'Months' : 'Month'}`
      }));
    }
  }, [studentData.course, studentData.durationOption]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'dob') {
      const age = calculateAge(value);
      setStudentData({ ...studentData, dob: value, age });
    } else if (files) {
      setStudentData({ ...studentData, [name]: files[0] });
    } else {
      setStudentData({ ...studentData, [name]: value });
    }
  };

  const handleDurationOptionChange = (e) => {
    const { value } = e.target;
    setStudentData(prevData => ({
      ...prevData,
      durationOption: value
    }));
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(studentData).forEach(key => {
      if (studentData[key] !== null && studentData[key] !== '') {
        formData.append(key, studentData[key]);
      }
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/students/${id}`, {
        method: 'PUT',
        body: formData
      });
      const result = await response.json();

      if (response.ok) {
        setRegistrationId(result.studentId || id);
        alert('Student updated successfully!');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the student');
    }
  };

  const isProgrammingCourse = (courseName) => {
    return [
      'Web Development using MERN',
      'Web Development using Java Springboot',
      'C Language',
      'C++ Language',
      'Core Java',
      'Advance Java',
      'Python',
      'Data Structure and Algorithms'
    ].includes(courseName);
  };

  const durationOptions = [
    { value: '', label: 'Select Duration' },
    ...(!isProgrammingCourse(studentData.course) ? [
      { value: '1 hour', label: '1 hour' },
    ] : []),
    { value: '2 hours', label: '2 hours' }
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-2 color-darkcyan">Update Student</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input type="text" name="name" className="form-control" value={studentData.name} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Father's Name</label>
          <input type="text" name="fatherName" className="form-control" value={studentData.fatherName} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Mother's Name</label>
          <input type="text" name="motherName" className="form-control" value={studentData.motherName} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">DOB</label>
          <input type="date" name="dob" className="form-control" value={studentData.dob} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Age</label>
          <input type="number" name="age" className="form-control" value={studentData.age} readOnly />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" value={studentData.email} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input type="tel" name="phone" className="form-control" value={studentData.phone} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Address</label>
          <textarea name="address" className="form-control" value={studentData.address} onChange={handleChange}></textarea>
        </div>
        <div className="col-md-6">
          <label className="form-label">Course</label>
          <select name="course" className="form-select" value={studentData.course} onChange={handleChange} required>
            <option value=''>Select Course</option>
            {courses.map(course => (
              <option key={course.name} value={course.name}>{course.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Duration Option</label>
          <select name="durationOption" className="form-select" value={studentData.durationOption} onChange={handleDurationOptionChange} required>
            {durationOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Fees</label>
          <input type="text" name="fees" className="form-control" value={studentData.fees} readOnly />
        </div>
        <div className="col-md-6">
          <label className="form-label">Duration</label>
          <input type="text" name="duration" className="form-control" value={studentData.duration} readOnly />
        </div>
        <div className="col-md-4">
          <label className="form-label">Photo</label>
          <input type="file" name="photo" className="form-control" accept="image/*" onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Marksheet</label>
          <input type="file" name="marksheet" className="form-control" onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Aadhaar</label>
          <input type="file" name="aadhaar" className="form-control" onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Reference</label>
          <input type="text" name="reference" className="form-control" value={studentData.reference} disabled />
        </div>
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary" disabled>Update Student</button>
        </div>
      </form>
      {registrationId && (
        <div className="alert alert-success mt-3">
          Student successfully updated! Registration ID: {registrationId}
        </div>
      )}
    </div>
  );
};

export default UpdateStudent;
