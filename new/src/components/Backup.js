import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; 
import './book.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [favorites, setFavorites] = useState([]); 
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('authToken'); 
          const response = await fetch(`http://localhost:5057/api/favorites/${user}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, 
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setFavorites(data.map(book => book.bookId)); 
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };

    fetchFavorites();
  }, [user]);

  const fetchBooks = async (keyword) => {
    setLoading(true);
    setError(null);

    const API_KEY = 'cbc4cf5a81msh25b994c17729712p1b5accjsncf716cd62888';

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

  const handleFavorite = async (book) => {
    if (!user) {
      alert('You must be logged in to favorite books.');
      return;
    }
  
    try {
      const token = localStorage.getItem('authToken'); 
  
      const response = await fetch('http://localhost:5057/api/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user,
          book,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && errorData.error === 'Book is already favorited') {
          alert('This book is already in your favorites.');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
  
      setFavorites(prevFavorites => [...prevFavorites, book.bookId]);
    } catch (error) {
      console.error('Error favoriting book:', error);
    }
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
              <button
                onClick={() => handleFavorite({
                  bookId: book.book_id,
                  name: book.name,
                  cover: book.cover,
                  authors: book.authors,
                  url: book.url,
                })}
                className={`favorite-button ${favorites.includes(book.book_id) ? 'favorited' : ''}`}
              >
                &#9733;
              </button>
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
