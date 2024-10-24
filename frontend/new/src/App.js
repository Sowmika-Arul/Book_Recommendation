// App.js
import React from 'react';
import BookList from './components/Book';
import Login from './components/Login'; 
import Front from './components/Front';
import Award from './components/Awarded_book';
import FeedForm from './components/FeedbackForm';
import FeedList from './components/FeedBackList';
import Reader from './components/BookReader';
import Profile from './components/Profile';
import Favorite from './components/Favorite';
import Recommendations from './components/Recommendations';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const userId = localStorage.getItem('userId'); // Retrieve userId

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/book" element={<BookList />} />
          <Route path="/front" element={<Front />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/award" element={<Award />} />
          <Route path="/feedform" element={<FeedForm />} />
          <Route path="/feedback" element={<FeedList />} />
          <Route path="/bookreader" element={<Reader />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/recommendations" element={<Recommendations userId={userId} />} />
        </Routes>
      </Router>
  );
}

export default App;
