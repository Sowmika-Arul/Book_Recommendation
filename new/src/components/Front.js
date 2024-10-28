import React from 'react';
import './front.css';
import Navbar from './Navbar.js';

const FrontPage = () => {
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
          <button className="explore-btn">Explore Now</button>
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
