import React, { useEffect, useState } from 'react';
import fetchRecommendedBooks from './recommendation'; 
import './Recommendations.css';
import Navbar from './Navbar.js';

const Recommendations = ({ userId }) => {
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                console.log('Fetching profile data for userId:', userId);
                const res = await fetch(`https://book-recommendation-backend.onrender.com/api/profile/${userId}`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const profileData = await res.json();

                const books = await fetchRecommendedBooks(profileData); 
    
                setRecommendedBooks(books); 
            } catch (error) {
                setError('Failed to fetch recommendations. Please try again later.'); 
            } finally {
                setLoading(false); 
            }
        };

        fetchRecommendations(); 
    }, [userId]);

    const handleAddToFavorites = (book) => {
        const bookData = {
            id: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors || [],
            publisher: book.volumeInfo.publisher || 'Unknown',
            publishedDate: book.volumeInfo.publishedDate || 'Unknown',
            thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '',
            webReaderLink: book.volumeInfo.infoLink || ''
        };

        fetch('https://book-recommendation-backend.onrender.com/favorites', {
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
            <h1>Personalized Recommendations</h1>
            {loading ? (
                <p>Loading recommendations...</p> 
            ) : error ? (
                <p>{error}</p> 
            ) : recommendedBooks.length > 0 ? (
                <div className="book-list">
                    {recommendedBooks.map((book, index) => (
                        <div key={index} className="book-card">
                            <a 
                                href={book.volumeInfo.infoLink} 
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover'}
                                    alt={book.volumeInfo.title}
                                    className="book-cover"
                                />
                                <div className="book-info">
                                    <h2>{book.volumeInfo.title}</h2>
                                    <p>by {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
                                    <p>{book.volumeInfo.categories?.join(', ') || 'No categories available'}</p>
                                </div>
                            </a>
                            <button className="favorite-button" onClick={() => handleAddToFavorites(book)}>
                                ❤️ Add to Favorites
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No recommendations available based on your preferences.</p>
            )}
        </div>
    );
};

export default Recommendations;