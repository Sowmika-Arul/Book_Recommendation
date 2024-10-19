import React from 'react';
import { AuthProvider } from './components/AuthContext'; // Adjust the path as needed
import BookList from './components/Newfile'; // Your BookList component
import Login from './components/Login'; // Your Login component
import Front from './components/Front';
import Award from './components/Awarded_book';
import FeedForm from './components/FeedbackForm';
import FeedList from './components/FeedBackList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/book" element={<BookList />} />
          <Route path="/front" element={<Front />} />
          <Route path="/award" element={<Award />} />
          <Route path="/feedform" element={<FeedForm />} />
          <Route path="/feedback" element={<FeedList />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
