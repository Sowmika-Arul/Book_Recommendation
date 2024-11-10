import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './BookReader.css';
import Navbar from './Navbar.js';

function App() {
  const [query, setQuery] = useState('');
  const [bookDetails, setBookDetails] = useState(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const navigate = useNavigate(); 

 
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/'); 
    }
  }, [navigate]); 

  const handleSearch = (event) => {
    event.preventDefault();
    setMessage('');
    setBookDetails(null);
    setShowModal(false); 

   
    fetch(`https://gutendex.com/books?search=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const book = data.results[0];
          const title = book.title;
          const authors = book.authors.map(author => author.name).join(', ');

          const description = (book.translations && book.translations.length > 0) 
            ? book.translations[0].description 
            : 'No description available.';

          const txtUrl = book.formats['text/plain; charset=us-ascii'];

          setBookDetails({
             title,
            authors,
            description,
            txtUrl
          });
        } else {
          setMessage('No books found for the search query.');
        }
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
        setMessage('Error fetching book data. Please try again later.');
      });
  };

  const handleOpenModal = () => {
    setShowModal(true); 
  };

  const handleCloseModal = () => {
    setShowModal(false); 
  };

  return (
    <div>
      <Navbar />
      <div className="app-container">
        <h1 className="app-title">Search for Books to Read</h1>
        <form className="search-form" onSubmit={handleSearch}>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Enter book title or author" 
            required 
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        {bookDetails && (
          <div className="book-details">
            <h2 className="book-title">{bookDetails.title}</h2>
            <p className="book-authors">Author(s): {bookDetails.authors}</p>
            <p className="book-description">{bookDetails.description}</p>
            {bookDetails.txtUrl && (
              <div>
                <button onClick={handleOpenModal} className="read-online-button">Read Online</button>
              </div>
            )}
          </div>
        )}

        {showModal && bookDetails && bookDetails.txtUrl && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={handleCloseModal} className="close-button">x</button>
              <iframe 
                src={bookDetails.txtUrl} 
                title="Book Reader" 
                className="book-iframe" 
                frameBorder="0"
              />
            </div>
          </div>
        )}

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default App;
