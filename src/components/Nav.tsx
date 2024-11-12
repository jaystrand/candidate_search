//import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="nav">
      <div className="nav-items">
        <Link to="/" className="nav-link">Candidate Search</Link>
        <Link to="/saved-candidates" className="nav-link">Saved Candidates</Link>
      </div>
    </nav>
  );
};

export default Nav;