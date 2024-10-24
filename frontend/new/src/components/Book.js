import React, { useState, useEffect } from 'react';
import './Book.css'; // Include the CSS changes here
import Navbar from './Navbar.js';

const BooksSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalBooks, setTotalBooks] = useState(0); // State for total number of books
  const booksPerPage = 12; // Number of books per page
  const apiKey = 'AIzaSyB1ZDjfU1JjNa8SE57ojxvCfQiHrBbCPy4';
  const userId = localStorage.getItem('userId'); // Fetch user ID from local storage

  const categories = [
    'Fiction',
    'Science',
    'Technology',
    'History',
    'Mystery',
    'Romance',
    'Fantasy',
    'Biography',
    'Self-Help',
  ];

  const authors = [
    'J.K. Rowling',
    'Stephen King',
    'Isaac Asimov',
    'Agatha Christie',
    'J.R.R. Tolkien',
    'George R.R. Martin',
    'Ernest Hemingway',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when a new search is made
    fetchBooks(query, 0); // Fetch the first set of books
  };

  const fetchBooks = (query, startIndex) => {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${booksPerPage}&key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          setBooks(data.items);
          setTotalBooks(Math.min(data.totalItems, 100)); // Cap total books to 100
          setError(null);
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
      fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${selectedCategory}&startIndex=${(currentPage - 1) * booksPerPage}&maxResults=12&key=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.items) {
            setBooks(data.items);
            setTotalBooks(Math.min(data.totalItems, 100)); // Cap total books to 100
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
    } else if (selectedAuthor) {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${selectedAuthor}&startIndex=${(currentPage - 1) * booksPerPage}&maxResults=12&key=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.items) {
            setBooks(data.items);
            setTotalBooks(Math.min(data.totalItems, 100)); // Cap total books to 100
            setError(null);
          } else {
            setBooks([]);
            setError('No books found for the selected author');
          }
        })
        .catch((error) => {
          setError('Error fetching books');
          console.error('Error fetching books:', error);
        });
    } else {
      setBooks([]);
    }
  }, [selectedCategory, selectedAuthor, currentPage]);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < Math.ceil(totalBooks / booksPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleAddToFavorites = (book) => {
    const bookData = {
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || [],
      publisher: book.volumeInfo.publisher || 'Unknown',
      publishedDate: book.volumeInfo.publishedDate || 'Unknown',
      thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '',
      webReaderLink: book.volumeInfo.webReaderLink || ''
    };

    // Use Fetch API to post favorite book to the server
    fetch('http://localhost:5057/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        book: bookData
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Book added to favorites:', data);
      alert('Book added to favorites');
    })
    .catch(error => {
      console.error('Error adding book to favorites:', error);
    });
  };

  return (
    <div>
      <Navbar />
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
                    onChange={() => {
                      setSelectedCategory(category);
                      setSelectedAuthor('');
                      setCurrentPage(1); // Reset to first page
                    }}
                  />
                  {category}
                </label>
              </li>
            ))}
          </ul>

          <h2>Authors</h2>
          <ul>
            {authors.map((author, index) => (
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    checked={selectedAuthor === author}
                    onChange={() => {
                      setSelectedAuthor(author);
                      setSelectedCategory('');
                      setCurrentPage(1); // Reset to first page
                    }}
                  />
                  {author}
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
                    
                    {/* Favorite Button */}
                    <button onClick={() => handleAddToFavorites(book)}>
                      ❤️ Add to Favorites
                    </button>
                  </div>
                );
              })}
          </div>

          {/* Pagination Controls with Arrows (aligned right) */}
          {totalBooks > booksPerPage && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {Math.ceil(totalBooks / booksPerPage)}</span>
              <button
                onClick={() => handlePageChange('next')}
                disabled={currentPage === Math.ceil(totalBooks / booksPerPage)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BooksSearch;
