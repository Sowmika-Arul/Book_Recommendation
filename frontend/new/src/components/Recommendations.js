import React, { useEffect, useState } from 'react';
import fetchRecommendedBooks from './recommendation'; 
import './Recommendations.css';

const Recommendations = ({ userId }) => {
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                console.log('Fetching profile data for userId:', userId); // Log userId
                const res = await fetch(`http://localhost:5057/api/profile/${userId}`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const profileData = await res.json();

                console.log('Profile data fetched:', profileData); // Log profile data

                // Log user's favorite details
                console.log('Favorite Books:', profileData.favoriteBooks);
                console.log('Favorite Authors:', profileData.favoriteAuthors);
                console.log('Favorite Genres:', profileData.favoriteGenres);
                console.log('Themes:', profileData.themes);

                // Fetch recommended books based on the profile
                const books = await fetchRecommendedBooks(profileData); // Pass entire profile object
                console.log('Recommended books fetched:', books); // Log fetched books

                setRecommendedBooks(books); // Update state with recommended books
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setError('Failed to fetch recommendations. Please try again later.'); // Set error message
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchRecommendations(); // Call the async function
    }, [userId]);

    return (
        <div>
            <h1>Recommended Books</h1>
            {loading ? (
                <p>Loading recommendations...</p> // Show loading message
            ) : error ? (
                <p>{error}</p> // Show error message if any
            ) : recommendedBooks.length > 0 ? (
                <div className="book-list">
                    {recommendedBooks.map((book, index) => (
                        <div key={index} className="book-card">
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
