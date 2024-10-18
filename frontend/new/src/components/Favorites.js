import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Import AuthContext for authentication
import './Favorites.css'; // Create a CSS file for styling if needed

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, authToken } = useAuth(); // Access the user from AuthContext

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setError('You must be logged in to view favorites.');
    }
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5057/api/favorites/${user}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}` // Add token to headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!user) {
      alert('You must be logged in to delete favorites.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5057/api/favorite/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}` ,
          'Content-Type': 'application/json' // Add token to headers
        },
        body: JSON.stringify({ userId: user }) 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the UI to remove the deleted book
      setFavorites(favorites.filter(book => book.bookId !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('An error occurred while deleting the book.');
    }
  };

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">Your Favorite Books</h2>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      {favorites.length > 0 ? (
        <ul className="favorites-list">
          {favorites.map(book => (
            <li key={book.bookId} className="favorites-item">
              <a href={book.url} target="_blank" rel="noopener noreferrer" className="favorites-link">
                <img src={book.cover} alt={book.name} className="favorites-cover" />
                <h3 className="favorites-title">{book.name}</h3>
                <p className="favorites-authors">{book.authors.join(', ')}</p>
              </a>
              <button
                onClick={() => handleDelete(book.bookId)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className="no-favorites">No favorites found.</p>
      )}
    </div>
  );
};

export default Favorites;
