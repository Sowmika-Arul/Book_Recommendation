import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './audio.css';
import {Link} from 'react-router-dom';

const AudiobooksList = () => {
  const [audiobooks, setAudiobooks] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [filteredAudiobooks, setFilteredAudiobooks] = useState([]); 

  useEffect(() => {
    axios
      .get('http://localhost:5057/audiobooks')  
      .then((response) => {
        console.log(response.data); 
        setAudiobooks(response.data.books || []);  
        setFilteredAudiobooks(response.data.books || []); 
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === '') {
      setFilteredAudiobooks(audiobooks);  
    } else {
      const filtered = audiobooks.filter((audiobook) =>
        audiobook.title.toLowerCase().includes(query.toLowerCase()) ||
        (audiobook.description && audiobook.description.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredAudiobooks(filtered); 
    }
    setCurrentPage(1); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAudiobooks = filteredAudiobooks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAudiobooks.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Audiobooks List</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="audiobooks-grid">
        {currentAudiobooks.map((audiobook) => (
          <div className="audiobook-card" key={audiobook.id}>
            <h3>{audiobook.title}</h3>
            <p><strong>Description:</strong></p>
            <p
              dangerouslySetInnerHTML={{
                __html: audiobook.description ? audiobook.description.split('<a').slice(0, 2).join('<a') : 'No description available',
              }}
            />
            <p><strong>Language:</strong> {audiobook.language || 'Unknown'}</p>
            <p><strong>Total Time:</strong> {audiobook.totaltime || 'Not available'}</p>

            <div className="button-container">

              <Link to={audiobook.url_librivox} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn audiobook-button"
              >
                Listen to the audio
              </Link>

              <Link to={audiobook.url_zip_file || audiobook.url_iarchive} 
                download 
                className="btn download-button"
              >
                Download the Audio
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AudiobooksList;
