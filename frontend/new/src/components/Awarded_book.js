import React, { useState } from 'react';
import './Abooks.css'; // Updated file name

const AwardedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [year, setYear] = useState('');

  const fetchAwardedBooks = async (year) => {
    const API_KEY = 'ca90fb524fmsh2f7fe869b635300p19cbf5jsnd4a8503f16b1';

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
      setError(null); // Clear previous errors
      fetchAwardedBooks(year);
    } else {
      setError('Please enter a valid year.');
    }
  };

  return (
    <div className="awarded-books-container">

      <div className="awarded-books-input">
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
      <h1><center>Awarded books of the year</center></h1>
      {/* Dynamic content area */}
      <div className="awarded-books-content">
        {loading && <p className="awarded-books-loading">Loading...</p>}
        {error && <p className="awarded-books-error">Error: {error}</p>}
      </div>

      {!loading && !error && books.length > 0 && (
        <ul className="awarded-books-list">
          {books.map((book) => (
            <li key={book.book_id} className="awarded-books-item">
              <a href={book.url} target="_blank" rel="noopener noreferrer" className="awarded-books-link">
                <img src={book.cover} alt={book.name} className="awarded-books-cover" />
                <h3 className="awarded-books-title-item">{book.name}</h3>
                <p className="awarded-books-category">
                  {book.category ? book.category : 'Unknown Category'}
                </p>
              </a>
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
