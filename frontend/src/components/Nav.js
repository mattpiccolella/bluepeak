import React from 'react';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/add-todo">Add Todo</Link>
      {/* More navigation links as needed */}
    </nav>
  );
}

export default Nav;
