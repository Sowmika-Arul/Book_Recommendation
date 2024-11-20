import React, { useState, useEffect } from 'react';
import './Book.css';
import Navbar from './Navbar.js';
import {Link} from 'react-router-dom';

const BooksSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const booksPerPage = 12;
  const apiKey = 'AIzaSyB1ZDjfU1JjNa8SE57ojxvCfQiHrBbCPy4'; 
  const userId = localStorage.getItem('userId');

  const categories = [
    'Fiction', 'Science', 'Technology', 'History', 'Mystery', 'Romance', 'Fantasy', 'Biography', 'Self-Help',
  ];

  const authors = [
    'J.K. Rowling', 'Stephen King', 'Isaac Asimov', 'Agatha Christie', 'J.R.R. Tolkien', 'George R.R. Martin', 'Ernest Hemingway',
  ];

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    fetch(`http://localhost:5057/favorites/${userId}`)
      .then((response) => response.json())
      .then((data) => {   console.log("Fetched favorites:", data); 
        setFavorites(Array.isArray(data) ? data : []);})
      .catch((error) => console.error('Error fetching favorites:', error));
  };

  const isFavorite = (bookId) => {
    // Ensure favorites is an array before calling .some()
    if (!Array.isArray(favorites)) {
      return false;
    }
    return favorites.some((fav) => fav.book && fav.book.id === bookId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks(query, 0);
  };

  const fetchBooks = (query, startIndex) => {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${booksPerPage}&key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          setBooks(data.items);
          setTotalBooks(Math.min(data.totalItems, 100));
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
    fetchBooks('fiction', (currentPage - 1) * booksPerPage);
  }, [currentPage]);

  useEffect(() => {
    if (selectedCategory) {
      fetchBooks(`subject:${selectedCategory}`, (currentPage - 1) * booksPerPage);
    } else if (selectedAuthor) {
      fetchBooks(`inauthor:${selectedAuthor}`, (currentPage - 1) * booksPerPage);
    } else if (query) {
      fetchBooks(query, (currentPage - 1) * booksPerPage);
    } else {
      setBooks([]);
    }
  }, [selectedCategory, selectedAuthor, query, currentPage]);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < Math.ceil(totalBooks / booksPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
    window.scrollTo(0, 0);
  };

  const handleAddToFavorites = (book) => {
    const bookData = {
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || [],
      publisher: book.volumeInfo.publisher || 'Unknown',
      publishedDate: book.volumeInfo.publishedDate || 'Unknown',
      thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '',
      webReaderLink: book.volumeInfo.infoLink || '',
    };
    console.log('Book Data:', bookData);
  
    if (isFavorite(book.id)) {
      // Remove from favorites
      const favoriteToRemove = favorites.find((fav) => fav.book.id === book.id);
      if (!favoriteToRemove) return; // Ensure the favorite exists

      fetch(`http://localhost:5057/favorites/${favoriteToRemove._id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(() => {
          // Optimistically update the favorites state
          setFavorites((prevFavorites) =>
            prevFavorites.filter((fav) => fav.book.id !== book.id)
          );
          alert('Book removed from favorites');
        })
        .catch((error) => {
          console.error('Error removing book from favorites:', error);
        });
    } else {
      // Add to favorites
      fetch('http://localhost:5057/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          book: bookData,
        }),
      })
        .then((response) => response.json())
        .then((newFavorite) => {
          // Optimistically update the favorites state
          setFavorites((prevFavorites) => [...prevFavorites, { book: bookData, _id: newFavorite._id }]);
          alert('Book added to favorites');
        })
        .catch((error) => {
          console.error('Error adding book to favorites:', error);
        });
    }
  };

  const generateWhatsAppLink = (book) => {
    const title = book.volumeInfo.title || 'Check out this book!';
    const link = book.volumeInfo.infoLink || window.location.href;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + link)}`;
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
                      setQuery('');
                      setCurrentPage(1);
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
                      setQuery('');
                      setCurrentPage(1);
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
                const { title, authors, publisher, publishedDate, imageLinks, infoLink } = book.volumeInfo;
                return (
                  <div key={index} className="book-item">
                    {imageLinks && imageLinks.thumbnail && (
                      <center>
                        <img src={imageLinks.thumbnail} alt={`Cover of ${title}`} />
                      </center>
                    )}
                    <h3>{title || 'No title'}</h3>
                    <p><strong>Authors:</strong> {authors ? authors.join(', ') : 'No authors'}</p>
                    <p><strong>Publisher:</strong> {publisher || 'No publisher'}</p>
                    <p><strong>Published Date:</strong> {publishedDate || 'No published date'}</p>

                    {infoLink && (
                      <p>
                        <Link to={infoLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          Read Online
                        </Link>
                      </p>
                    )}

                    <button
                      className="favorite-button"
                      onClick={() => handleAddToFavorites(book)}
                    >
                      {isFavorite(book.id) ? '❌ Remove from Favorites' : '❤️ Add to Favorites'}
                    </button>

                    <Link to={generateWhatsAppLink(book)} target="_blank" rel="noopener noreferrer">
                      <button className="whatsapp-button">📤 Share on WhatsApp</button>
                    </Link>
                  </div>
                );
              })}
          </div>

          {totalBooks > booksPerPage && (
            <div className="pagination">
              <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
                Previous
              </button>
              <span>Page {currentPage} of {Math.ceil(totalBooks / booksPerPage)}</span>
              <button onClick={() => handlePageChange('next')} disabled={currentPage === Math.ceil(totalBooks / booksPerPage)}>
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
