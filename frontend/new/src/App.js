import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; // Import the Login component
import FrontPage from './components/Front'; // Import the FrontPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Root path for login */}
        <Route path="/front" element={<FrontPage />} /> {/* New route for front page */}
      </Routes>
    </Router>
  );
}

export default App;
