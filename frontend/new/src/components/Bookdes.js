import React, { useState } from 'react';
import './Bookdes.css';  // Ensure this CSS file has the relevant styles

const BooksByMonth = () => {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!query) {
            setError('Please enter a query');
            return;
        }

        setLoading(true);
        setError(null);
        setBooks([]);

        try {
            const response = await fetch(`https://hapi-books.p.rapidapi.com/month/${query}`, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': 'ca90fb524fmsh2f7fe869b635300p19cbf5jsnd4a8503f16b1',
                    'x-rapidapi-host': 'hapi-books.p.rapidapi.com',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setBooks(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="books-container">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter year/month (e.g., 2022/3)"
                className="books-search-input"
            />
            <button onClick={handleSearch} className="books-search-button">Search</button>

            {loading && <div className="books-loading">Loading...</div>}
            {error && <div className="books-error">Error: {error}</div>}
            {books.length === 0 && !loading && !error && <div className="books-no-results">No books found</div>}
            {books.length > 0 && (
                <div>
                    <h1 className="books-header">Books</h1>
                    <ul className="books-list">
                        {books.map((book, index) => (
                            <li key={index} className="books-item">
                                <img
                                    src={book.cover}
                                    alt={book.name}
                                    className="books-cover"
                                />
                                <div className="books-info">
                                    <p><strong>Position:</strong> {book.position}</p>
                                    <p><strong>Name:</strong> {book.name}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default BooksByMonth;
