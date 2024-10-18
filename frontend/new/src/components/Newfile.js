import React, { useState, useEffect } from 'react';
import './new.css';

const BooksSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const apiKey = 'AIzaSyB1ZDjfU1JjNa8SE57ojxvCfQiHrBbCPy4';

  const categories = [
    'Fiction',
    'Science',
    'Technology',
    'History',
    'Mystery',
    'Romance',
    'Fantasy',
    'Biography',
    'Non-Fiction',
    'Self-Help',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBooks(query);
  };

  const fetchBooks = (query) => {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.items) {
          setBooks(data.items);
        } else {
          setBooks([]);
          setError('No books found');
        }
      })
      .catch((error) => {
        setError('Error fetching books');
        console.error('Error fetching books:', error);
      });
  };

  useEffect(() => {
    if (selectedCategory) {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${selectedCategory}&key=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.items) {
            setBooks(data.items);
            setError(null);
          } else {
            setBooks([]);
            setError('No books found for the selected category');
          }
        })
        .catch((error) => {
          setError('Error fetching books');
          console.error('Error fetching books:', error);
        });
    } else {
      setBooks([]);
    }
  }, [selectedCategory]);

  return (
    <div className="book-search-container">
      <div className="sidebar">
        <h2>Categories</h2>
        <ul>
          {categories.map((category, index) => (
            <li key={index}>
              <label>
                <input
                  type="radio"
                  checked={selectedCategory === category}
                  onChange={() => setSelectedCategory(category)}
                />
                {category}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <h1>Book Search</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter book title or author"
          />
          <button type="submit">Search</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="book-list">
          {books.length > 0 &&
            books.map((book, index) => {
              const { title, authors, publisher, publishedDate, imageLinks, webReaderLink } = book.volumeInfo;

              return (
                <div key={index} className="book-item">
                  {imageLinks && imageLinks.thumbnail && (
                    <img src={imageLinks.thumbnail} alt={`Cover of ${title}`} />
                  )}

                  <h3>{title || 'No title'}</h3>
                  <p><strong>Authors:</strong> {authors ? authors.join(', ') : 'No authors'}</p>
                  <p><strong>Publisher:</strong> {publisher || 'No publisher'}</p>
                  <p><strong>Published Date:</strong> {publishedDate || 'No published date'}</p>
                  
                  {webReaderLink && (
                    <p>
                      <a href={webReaderLink} target="_blank" rel="noopener noreferrer">
                        Read Online
                      </a>
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default BooksSearch;
