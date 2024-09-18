import React, { useState } from 'react';
import './book.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchBooks = async (keyword) => {
    setLoading(true);
    setError(null);

    const API_KEY = 'ca90fb524fmsh2f7fe869b635300p19cbf5jsnd4a8503f16b1';

    try {
      const response = await fetch(`https://hapi-books.p.rapidapi.com/search/${encodeURIComponent(keyword)}`, {
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

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log(data);
      setBooks(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchBooks(searchKeyword);
  };

  const handleChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  return (
    <div className="book-list-container">
      <h2 className="book-list-title">Book List</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for books..."
          value={searchKeyword}
          onChange={handleChange}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      {books.length > 0 ? (
        <ul className="book-list">
          {books.map(book => (
            <li key={book.book_id} className="book-item">
              <a href={book.url} target="_blank" rel="noopener noreferrer" className="book-link">
                <img src={book.cover} alt={book.name} className="book-cover" />
                <h3 className="book-title">{book.name}</h3>
                <p className="book-authors">{book.authors.join(', ')}</p>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className="no-books">No books found.</p>
      )}
    </div>
  );
};

export default BookList;
