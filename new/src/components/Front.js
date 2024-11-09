import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './front.css';
import Navbar from './Navbar.js';

const FrontPage = () => {
  const navigate = useNavigate(); // useNavigate hook for redirection
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  // Check for userId in localStorage and redirect to login if it's not present
  useEffect(() => {
    if (!userId) {
      navigate('/'); // Redirect to login if no userId
    }
  }, [userId, navigate]);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="left-side">
          <h1>Book Collection</h1>
          <p>
            Find the best e-books from your favorite writers, explore hundreds of
            books with all possible categories, take advantage of the 50% discount
            and much more.
          </p>
         <a href="/book"><button className="explore-btn">Explore Now</button></a>
        </div>

        <div className="right-side">
          <div className="book book1"></div>
          <div className="book book2"></div>
          <div className="book book3"></div>
        </div>
      </div>
    </>
  );
};

export default FrontPage;
