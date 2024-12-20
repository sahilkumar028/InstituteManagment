import React, { useState, useEffect } from 'react';

const EnquiryForm = () => {
  const [enquiryData, setEnquiryData] = useState({
    date: '',
    name: '',
    phone: '',
    course: '',
    remarks: ''
  });

  const [registrationId, setRegistrationId] = useState(null);

  const courses = [
    { name: 'Office Automation' },
    { name: 'Diploma in Computer Application and Accounting' },
    { name: 'Advance Diploma in Computer Application' },
    { name: 'Advance Excel' },
    { name: 'Tally/Tally Prime' },
    { name: 'Auto CAD' },
    { name: 'Web Development using MERN' },
    { name: 'Web Development using Java Springboot' },
    { name: 'C Language' },
    { name: 'C++ Language' },
    { name: 'Core Java' },
    { name: 'Advance Java' },
    { name: 'Python' },
    { name: 'Data Structure and Algorithms' },
    { name: 'Certificate Courses' }
  ];

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    setEnquiryData(prevData => ({
      ...prevData,
      date: formattedToday
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData({ ...enquiryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(enquiryData).forEach(key => {
      formData.append(key, enquiryData[key]);
    });
  
    try {
      const response = await fetch('http://192.168.1.250:5000/add-enquiry', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        setRegistrationId(result.enquiryId); // Store the enquiry ID
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the enquiry');
    }
  };
  
  

  return (
    <div className='container'>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="date" className="form-label">Date</label>
            <input type="date" id="date" placeholder='date' name="date" value={enquiryData.date} className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" id="name" placeholder='name' name="name" value={enquiryData.name} onChange={handleChange} className="form-control" required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Phone No.</label>
            <input type="tel" id="phone" placeholder='phone' name="phone" value={enquiryData.phone} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="course" className="form-label">Course</label>
            <select id="course" name="course" value={enquiryData.course} onChange={handleChange} className="form-control" required>
              <option value="">Select Course</option>
              {courses.map((course, index) => (
                <option key={index} value={course.name}>{course.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-12">
            <label htmlFor="remarks" className="form-label">Remarks</label>
            <textarea id="remarks" placeholder='remarks' name="remarks" value={enquiryData.remarks} onChange={handleChange} className="form-control"></textarea>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      {registrationId && (
        <div className="alert alert-success mt-3">
          Enquiry successfully registered! Enquiry ID: {registrationId}
        </div>
      )}
    </div>
  );
};

export default EnquiryForm;
