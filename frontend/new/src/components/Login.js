import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css'; 
import imgbook from '../assets/images/book.avif';

function Login() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up form
  const [formData, setFormData] = useState({
    name: '',      // Only needed for sign-up
    email: '',
    password: ''
  });
  const navigate = useNavigate(); // Hook for navigation

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission (login or sign-up)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Choose the appropriate endpoint for login or sign-up
    const endpoint = isLogin 
      ? 'http://localhost:5057/api/auth/login' 
      : 'http://localhost:5057/api/auth/signup';

    try {
      // Send the request to the backend
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Get the result from the backend
      const result = await response.json();
      console.log('Success:', result);

      // Store token and user ID if available
      if (result.token) {
        localStorage.setItem('authToken', result.token); // Store the token
        console.log('Token:', result.token);
      }

      if (result.userId) {
        localStorage.setItem('userId', result.userId); // Store the user ID
        console.log('User ID:', result.userId);
      }

      // Redirect to the main application after login/signup
      navigate('/front'); // Adjust the path as needed
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Toggle between login and sign-up form
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' }); // Reset form data when toggling
  };

  return (
    <div className="new">
      <div className={`login-container ${isLogin ? '' : 'reverse-layout'}`}>
        <div className="books-section">
          <img 
            src={imgbook} 
            alt="Books" 
            className="books-img" 
          />
        </div>
        
        <div className="login-section">
          <form className="login-form" onSubmit={handleSubmit}>
            {isLogin ? (
              <>
                <h2><center>Escape into stories!</center></h2>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />

                <button type="submit">Login</button>
                <p>
                  Don't have an account?{' '}
                  <a href="#signup" onClick={toggleForm}>
                    Sign Up
                  </a>
                </p>
              </>
            ) : (
              <>
                <h2><center>Join Our Community!</center></h2>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />

                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />

                <button type="submit">Sign Up</button>
                <p>
                  Already have an account?{' '}
                  <a href="#login" onClick={toggleForm}>
                    Login
                  </a>
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;