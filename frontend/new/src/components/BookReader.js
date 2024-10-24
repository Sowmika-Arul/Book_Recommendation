// src/App.js
import React, { useState } from 'react';
import Recommendations from './Recommendations'; // Import Recommendations component
import './BookReader.css'; // Updated CSS file name

function App() {
  const [query, setQuery] = useState('');
  const [bookDetails, setBookDetails] = useState(null);
  const [message, setMessage] = useState('');

  // Handler to search for books based on clicked book title
  const handleBookClick = (bookTitle) => {
    console.log(`Book clicked: ${bookTitle}`); // Add a log to debug
    setQuery(bookTitle); // Set query to the book title
    setMessage(''); // Clear previous messages
    setBookDetails(null); // Clear previous book details

    // Fetch data from Gutendex API
    fetch(`https://gutendex.com/books?search=${encodeURIComponent(bookTitle)}`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const book = data.results[0]; // Get the first book result
          const title = book.title;
          const authors = book.authors.map(author => author.name).join(', ');

          const description = book.translations?.[0]?.description || 'No description available.';
          const txtUrl = book.formats['text/plain; charset=us-ascii'];

          setBookDetails({
            title,
            authors,
            description,
            txtUrl
          });
        } else {
          setMessage('No books found for the search query.');
        }
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
        setMessage('Error fetching book data. Please try again later.');
      });
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Search for Books on Project Gutenberg</h1>

      {/* Pass the handleBookClick function to Recommendations */}
      <Recommendations userId="1" onBookClick={handleBookClick} /> {/* Pass onBookClick prop */}

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
