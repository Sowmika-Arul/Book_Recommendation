import React, { useState, useEffect } from 'react';
import './FeedBackList.css';
import Navbar from './Navbar.js';
import { useNavigate } from 'react-router-dom';

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [ratingFilter, setRatingFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState(''); 
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            setErrorMessage('You need to be logged in to view the feedback.');
            navigate('/');
        } else {
            const fetchFeedbacks = async () => {
                try {
                    const response = await fetch('https://book-recommendation-backend.onrender.com/api/feedback');
                    if (response.ok) {
                        const data = await response.json();
                        setFeedbacks(data);
                        setFilteredFeedbacks(data);
                    } else {
                        console.error('Failed to fetch feedback');
                    }
                } catch (err) {
                    console.error('Error fetching feedback:', err);
                }
            };

            fetchFeedbacks();
        }
    }, [userId, navigate]);

    useEffect(() => {
        let filtered = feedbacks;

        if (ratingFilter !== 'All') {
            filtered = filtered.filter(feedback => feedback.rating === parseInt(ratingFilter));
        }

        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(feedback =>
                feedback.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredFeedbacks(filtered);
    }, [ratingFilter, searchTerm, feedbacks]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <Navbar />
            <div className="feedback-list-container">
                <h2>Feedback List</h2>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="filter-container">
                    <label htmlFor="rating-filter">Filter by Rating:</label>
                    <select
                        id="rating-filter"
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                    </select>

                    {/* New search input for filtering by book name */}
                    <label htmlFor="search-term">Search by Book Name:</label>
                    <input
                        id="search-term"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter book name..."
                    />
                </div>

                {filteredFeedbacks.length > 0 ? (
                    filteredFeedbacks.map(feedback => (
                        <div key={feedback._id} className="feedback-item">
                            <h4>{feedback.bookTitle} by {feedback.author}</h4>
                            <p className="feedback-rating">Rating: {feedback.rating}</p>
                            <p>{feedback.comments}</p>
                            <p className="feedback-date">Submitted on: {formatDate(feedback.reviewDate)}</p>
                        </div>
                    ))
                ) : (
                    <p>No feedbacks available for the selected criteria.</p>
                )}
            </div>
        </div>
    );
};

export default FeedbackList;
