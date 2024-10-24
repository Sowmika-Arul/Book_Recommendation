// src/App.js
import React, { useState } from 'react';
import './BookReader.css'; // Updated CSS file name

function App() {
  const [query, setQuery] = useState('');
  const [bookDetails, setBookDetails] = useState(null);
  const [message, setMessage] = useState('');

  const handleSearch = (event) => {
    event.preventDefault(); // Prevent default form submission
    setMessage(''); // Clear previous messages
    setBookDetails(null); // Clear previous book details

    // Fetch data from Gutendex API
    fetch(`https://gutendex.com/books?search=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const book = data.results[0]; // Get the first book result
          const title = book.title;
          const authors = book.authors.map(author => author.name).join(', ');

          // Check if translations exist and assign description
          const description = (book.translations && book.translations.length > 0) 
            ? book.translations[0].description 
            : 'No description available.';

          // Get download link for plain text format
          const txtUrl = book.formats['text/plain; charset=us-ascii'];

          setBookDetails({
            title,
            authors,
            description,
            txtUrl
          });
        } else {
          setMessage('No books found for the search query.'); // Alert if no books found
        }
      })
      .catch(error => {
        console.error('Error fetching book data:', error); // Log any errors
        setMessage('Error fetching book data. Please try again later.');
      });
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Search for Books on Project Gutenberg</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Enter book title or author" 
          required 
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {bookDetails && (
        <div className="book-details">
          <h2 className="book-title">{bookDetails.title}</h2>
          <p className="book-authors">Author(s): {bookDetails.authors}</p>
          <p className="book-description">{bookDetails.description}</p>
          {bookDetails.txtUrl && (
            <a href={bookDetails.txtUrl} className="download-link" target="_blank" rel="noopener noreferrer">
              Read Book
            </a>
          )}
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;
