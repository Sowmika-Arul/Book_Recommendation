import React, { useState, useEffect } from 'react';
import './FeedBackList.css'; 
import Navbar from './Navbar.js';

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await fetch('http://localhost:5057/api/feedback');
                if (response.ok) {
                    const data = await response.json();
                    setFeedbacks(data);
                } else {
                    console.error('Failed to fetch feedback');
                }
            } catch (err) {
                console.error('Error fetching feedback:', err);
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <div>
         <Navbar/>
        <div className="feedback-list-container">
            <h2>Feedback List</h2>
            {feedbacks.map(feedback => (
                <div key={feedback._id} className="feedback-item">
                    <h4>{feedback.bookTitle} by {feedback.author}</h4>
                    <p className="feedback-rating">Rating: {feedback.rating}</p>
                    <p>{feedback.comments}</p>
                </div>
            ))}
        </div>
        </div>
    );
};

export default FeedbackList;
