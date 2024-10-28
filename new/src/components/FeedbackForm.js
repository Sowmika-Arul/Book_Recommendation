import React, { useState } from 'react';
import './FeedbackForm.css';
import Navbar from './Navbar.js'; 

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        bookTitle: '',
        author: '',
        rating: 1,
        comments: '',
        reviewDate: ''  // Add reviewDate field
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Capture the current date when submitting feedback
        const currentDate = new Date().toISOString();  // Capture in ISO format
        const updatedFormData = { ...formData, reviewDate: currentDate };

        try {
            const response = await fetch('http://localhost:5057/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData)  // Send the updated form data with reviewDate
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
