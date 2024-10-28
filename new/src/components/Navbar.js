const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="logo">Book Recommendation</div>
        <ul className="nav-links">
          {/* <li><a href="/">Home</a></li> */}
          <li><a href="/feedback">Reviews</a></li>
          <li><a href="/recommendations">Recommendations</a></li>
          <li><a href="/award">Top Pick</a></li>
          <li><a href="/feedform">Testimonial</a></li>
          <li><a href="/favorite">Favorites</a></li>
          <li><a href="/bookreader">Book Reader</a></li>
        </ul>
        <div className="nav-icons">
        <a href="/book"><i className="fas fa-search"></i></a>
         <a href="/profile"> <i className="fas fa-user"></i></a>
        </div>
      </nav>
    );
  };
export default Navbar;