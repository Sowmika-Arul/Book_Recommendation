import React, { useState, useEffect } from 'react';
import './FeedbackForm.css';
import Navbar from './Navbar.js'; 
import { useNavigate } from 'react-router-dom';

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        bookTitle: '',
        author: '',
        rating: 1,
        comments: '',
        reviewDate: '' 
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
  

    const userId = localStorage.getItem('userId'); 
  
    useEffect(() => {
        if (!userId) {
            setErrorMessage('You need to be logged in to submit feedback.');
            navigate('/');  
        }
    }, [userId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

      
        if (!userId) {
            alert('You need to be logged in to submit feedback.');
            return;
        }

      
        const currentDate = new Date().toISOString();  
        const updatedFormData = { ...formData, reviewDate: currentDate, userId };  
        try {
            const response = await fetch('http://localhost:5057/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData)  
            });

            if (response.ok) {
                alert('Feedback submitted successfully!');
                setFormData({ bookTitle: '', author: '', rating: 1, comments: '', reviewDate: '' });
            } else {
                alert('Error submitting feedback');
            }
        } catch (err) {
            console.error(err);
            alert('Error submitting feedback');
        }
    };

    return (
        <div>
            <Navbar /> 
            <div className="feedback-container">
                <h2>Submit Feedback</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Book Title:</label>
                        <input
                            type="text"
                            name="bookTitle"
                            value={formData.bookTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Author:</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Rating:</label>
                        <select name="rating" value={formData.rating} onChange={handleChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div>
                        <label>Comments:</label>
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;
