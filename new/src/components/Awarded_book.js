import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import './Abooks.css'; 
import Navbar from './Navbar.js';

const AwardedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [year, setYear] = useState('2023'); 
  const [userId, setUserId] = useState(null); 
  const navigate = useNavigate(); 

  const fetchAwardedBooks = async (year) => {
    const API_KEY = '0ecc576b47mshbc0ab5d515aa6eep1d1dbajsnfa44d559c207';

    try {
      setLoading(true);
      const response = await fetch(`https://hapi-books.p.rapidapi.com/top/${year}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'hapi-books.p.rapidapi.com'
        }
      });

      if (response.status === 429) {
        setError('Rate limit exceeded. Please try again later.');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setBooks(data || []);
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (year && year > 0) {
      setError(null); 
      fetchAwardedBooks(year);
    } else {
      setError('Please enter a valid year.');
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchAwardedBooks(year); 
    } else {
      setError('User not logged in. Redirecting to login page...');
      navigate('/');
    }
  }, [year, navigate]); 

  return (
    <div className="awarded-books-container">
      <Navbar />
      <div className="search-box-container">
        <div className="awarded-books-input">
        <div className="input-container"> 
          <label htmlFor="year">Enter Year:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2021"
          />
           <button onClick={handleSearch}>Search</button>
           </div>
        </div>
      </div>

      <h1><center>Awarded Books of the Year</center></h1>


      <div className="awarded-books-content">
        {loading && <p className="awarded-books-loading">Loading...</p>}
        {error && <p className="awarded-books-error">Error: {error}</p>}
      </div>

      {!loading && !error && books.length > 0 && (
        <ul className="awarded-books-list">
          {books.map((book) => (
            <li key={book.book_id} className="awarded-books-item">
              <Link to={book.url} target="_blank" rel="noopener noreferrer" className="awarded-books-link">
                <img src={book.cover} alt={book.name} className="awarded-books-cover" />
                <h3 className="awarded-books-title-item">{book.name}</h3>
                <p className="awarded-books-category">
                  {book.category ? book.category : 'Unknown Category'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && books.length === 0 && (
        <p className="awarded-books-no-results">No books found for the year {year}.</p>
      )}
    </div>
  );
};

export default AwardedBooks;
