import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    
    navigate('/'); 
  };

  return (
    <nav className="navbar">
      <div className="logo">Book Recommendation</div>
      <ul className="nav-links">
      <li><Link to="/front">Home</Link></li>
        <li><Link to="/feedback">Reviews</Link></li>
        <li><Link to="/recommendations">Recommendations</Link></li>
        <li><Link to="/award">Top Pick</Link></li>
        <li><Link to="/feedform">Testimonial</Link></li>
        <li><Link to="/favorite">Favorites</Link></li>
        <li><Link to="/bookreader">Book Reader</Link></li>
      </ul>
      <div className="nav-icons">
        <Link to="/book"><i className="fas fa-search"></i></Link>
        <Link to="/profile"><i className="fas fa-user"></i></Link>
        
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
