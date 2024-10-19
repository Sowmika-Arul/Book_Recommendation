const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="logo">Book Recommendation</div>
        <ul className="nav-links">
          {/* <li><a href="/">Home</a></li> */}
          <li><a href="/book">Book Collection</a></li>
          <li><a href="/feedback">Reviews</a></li>
          <li><a href="/">Trending Books</a></li>
          <li><a href="/award">Top Pick</a></li>
          <li><a href="/feedform">Testimonial</a></li>
        </ul>
        <div className="nav-icons">
          <i className="fas fa-search"></i>
          <i className="fas fa-user"></i>
        </div>
      </nav>
    );
  };
export default Navbar;