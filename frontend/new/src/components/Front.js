import React from 'react';
import './front.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Book Recommendation</div>
      <ul className="nav-links">
        {/* <li><a href="/">Home</a></li> */}
        <li><a href="/book">Book Collection</a></li>
        <li><a href="/feedback">Reviews</a></li>
        <li><a href="/favorite">Favorites</a></li>
        <li><a href="/award">Top Pick</a></li>
        <li><a href="/feedform">Testimonial</a></li>
      </ul>
      <div className="nav-icons">
        <i className="fas fa-search"></i>
        <i className="fas fa-user"></i>
      </div>
    </nav>
  );
};

const FrontPage = () => {
  return (
    <>
      <Navbar /> 
      <div className="container">
        <div className="left-side">
          <h1>Book<br />Collection</h1>
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
