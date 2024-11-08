import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './audio.css';

const AudiobooksList = () => {
  const [audiobooks, setAudiobooks] = useState([]);  // Holds the full list of audiobooks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredAudiobooks, setFilteredAudiobooks] = useState([]); // State for filtered audiobooks (search results)

  useEffect(() => {
    axios
      .get('http://localhost:5057/audiobooks')  // Fetch audiobooks from your server
      .then((response) => {
        console.log(response.data); // Log to inspect response structure
        setAudiobooks(response.data.books || []);  // Store all audiobooks in the full list
        setFilteredAudiobooks(response.data.books || []);  // Initially set filtered list to full list
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

    // Filter the audiobooks based on the search query from the full list of audiobooks
    if (query === '') {
      setFilteredAudiobooks(audiobooks);  // Reset the filter when search query is empty
    } else {
      const filtered = audiobooks.filter((audiobook) =>
        audiobook.title.toLowerCase().includes(query.toLowerCase()) ||
        (audiobook.description && audiobook.description.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredAudiobooks(filtered); // Set filtered audiobooks based on search query
    }
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Logic for pagination based on filtered audiobooks
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAudiobooks = filteredAudiobooks.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages based on filtered audiobooks
  const totalPages = Math.ceil(filteredAudiobooks.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Audiobooks List</h1>

      {/* Search Input */}
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

            {/* Buttons Container */}
            <div className="button-container">
              {/* Listen to Audiobook Button */}
              <a 
                href={audiobook.url_librivox} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn audiobook-button"
              >
                Listen to the audio
              </a>

              {/* Download Audiobook Button */}
              <a 
                href={audiobook.url_zip_file || audiobook.url_iarchive} 
                download 
                className="btn download-button"
              >
                Download the Audio
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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
