import React, { useState } from 'react';
import './Login.css'; 
import imgbook from '../assets/images/book.avif';

function Login() {
  // useState to toggle between login and signup views
  const [isLogin, setIsLogin] = useState(true);
  
  // useState for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'http://localhost:5057/api/auth/login' : 'http://localhost:5057/api/auth/signup';
    
    try {
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

      const result = await response.json();
      console.log('Success:', result);

      // Redirect or update UI based on response
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Toggle function
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' }); // Reset form data on toggle
  };

  return (
    <div className={`login-container ${isLogin ? '' : 'reverse-layout'}`}>
      {/* Image Section */}
      <div className="books-section">
        <img 
          src={imgbook}
          alt="Books" 
          className="books-img" 
        />
      </div>
      
      {/* Form Section */}
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
  );
}

export default Login;
