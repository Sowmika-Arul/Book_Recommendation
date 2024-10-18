import React from 'react';
import { AuthProvider } from './components/AuthContext'; // Adjust the path as needed
import BookList from './components/Book'; // Your BookList component
import Login from './components/Login'; // Your Login component
import Favorites from './components/Favorites';
import Front from './components/Front';
import Award from './components/Awarded_book';
import New from './components/Newfile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/book" element={<BookList />} />
          <Route path="/fav" element={<Favorites />} />
          <Route path="/front" element={<Front />} />
          <Route path="/award" element={<Award />} />
          <Route path="/new" element={<New />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
