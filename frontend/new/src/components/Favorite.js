import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.js';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('User ID not found in local storage');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchFavorites = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:5057/favorites/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch favorites');
          }
          const data = await response.json();
          setFavorites(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }
  }, [userId]);

  const handleDelete = async (favoriteId) => {
    try {
      const response = await fetch(`http://localhost:5057/favorites/${favoriteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete favorite');
      }

      // Filter out the deleted favorite from the state
      setFavorites((prevFavorites) => prevFavorites.filter(favorite => favorite._id !== favoriteId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading favorites...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
    <Navbar/>
    <div className="fav-page">
      <h2>Your Favorite Books</h2>
      {favorites.length === 0 ? (
        <p>No favorites found.</p>
      ) : (
        <div className="fav-book-list">
          {favorites.map((favorite) => (
            <div key={favorite._id} className="fav-book-item">
              <img src={favorite.book.thumbnail} alt={favorite.book.title} className="book-image" />
              <div className="book-details">
                <h3>{favorite.book.title}</h3>
                <p><strong>Author:</strong> {favorite.book.authors.join(', ')}</p>
                <p><strong>Published:</strong> {favorite.book.publishedDate}</p>
                <button className="fav-delete-button" onClick={() => handleDelete(favorite._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
</div>
      <style jsx>{`
        /* Container for the favorites page */
        .fav-page {
          padding: 40px;
          background-color: #f0f4f8; /* Light background for contrast */
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          max-width: 600px; /* Centering the content */
          margin: 20px auto; /* Centering the page */
        }

        /* Heading styling */
        .fav-page h2 {
          margin-bottom: 30px;
          font-size: 24px;
          color: #333;
          text-align: center; /* Center the title */
        }

        /* Book list container */
        .fav-book-list {
          display: flex;
          flex-direction: column;
          gap: 20px; /* Space between book items */
        }

        /* Book item styling */
        .fav-book-item {
          display: flex; /* Align image and details side by side */
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          text-align: left;
          transition: transform 0.2s; /* Smooth scale effect */
        }

        /* Scale effect on hover */
        .fav-book-item:hover {
          transform: scale(1.02); /* Slightly scale up on hover */
        }

        /* Book image styling */
        .book-image {
          width: 100px; /* Fixed width for the book image */
          border-radius: 10px;
          margin-right: 20px; /* Space between image and text */
        }

        /* Book details styling */
        .book-details {
          flex-grow: 1; /* Take up remaining space */
        }

        /* Book title styling */
        .book-details h3 {
          font-size: 20px;
          margin: 10px 0;
          color: #333;
        }

        /* Metadata styling */
        .book-details p {
          margin: 5px 0;
          font-size: 16px;
          color: #555;
        }

        /* Delete button styling */
        .fav-delete-button {
          padding: 10px 15px;
          background-color: #ff4d4d; /* Red color for delete */
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease; /* Added transform */
        }

        .fav-delete-button:hover {
          background-color: #ff1a1a; /* Darker red on hover */
          transform: scale(1.05); /* Slightly enlarge button on hover */
        }
      `}</style>
    </div>
  );
};

export default FavoritesPage;
