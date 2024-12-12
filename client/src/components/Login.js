import React, { useState } from 'react';
import axios from 'axios';
import './login.css'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://192.168.1.250:5000/api/login', credentials);

      // Store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      console.log(response.data.message); // "Login successful"
      // Redirect to dashboard or another page after successful login
      window.location.href = '/dashboard';  // Example redirect
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid h-100">
        
      <div className="row h-100">
        {/* Left Side - Image */}
        <div className="col-md-6 d-flex align-items-center position-relative" style={{ backgroundImage: 'url(https://www.wakefit.co/blog/wp-content/uploads/2022/01/Notes-min.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <img src="https://sahaskillinstitute.com/img/logo2.png" alt="Logo" className="w-25 position-absolute top-0" />
          <div className="text-center text-white w-100">
            <h1>Welcome to Our Platform</h1>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="col-md-6 d-flex justify-content-center align-items-center bg-light">
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="card-body">
              <h4 className="card-title text-center">Login</h4>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    value={credentials.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
