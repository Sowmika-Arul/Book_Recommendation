import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; 
import FrontPage from './components/Front';
import Book from './components/Book';
import Award from './components/Awarded_book';
import Desc from './components/Bookdes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/front" element={<FrontPage />} /> 
        <Route path="/book" element={<Book/>}/>
        <Route path="/award" element={<Award/>}/>
        <Route path="/des" element={<Desc/>}/>
      </Routes>
    </Router>
  );
}

export default App;
