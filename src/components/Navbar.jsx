
// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // (You can extract styles from Shop.css)

const Navbar = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <header className="main-navbar">
      <div className="nav-container">
        <div className="logo">JOCAL</div>
        <form className="search" onSubmit={handleSearch}>
          <input
            type="text"
            className="search__input"
            placeholder="Search on Jocal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search__button">
            <svg className="search__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M505 442.7L405.3 343a208.1 208.1 0 0044.4-129C449.7 95.7 353.9 0 234.9 0S20.1 95.7 20.1 214.7s95.8 214.7 214.8 214.7c48.6 0 93.2-15.8 129-44.4l99.7 99.7c4.5 4.5 10.4 6.7 16.3 6.7s11.8-2.2 16.3-6.7c9-9 9-23.6 0-32.6zM234.9 378.3c-90.1 0-163.6-73.5-163.6-163.6S144.8 51.1 234.9 51.1s163.6 73.5 163.6 163.6-73.5 163.6-163.6 163.6z" />
            </svg>
          </button>
        </form>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/deals">Deals</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="nav-icons">
          <i className="fa-regular fa-user"></i>
          <Link to="/wishlist" style={{ textDecoration: 'none', color: 'inherit' }}>
            <i className="fa-regular fa-heart"></i>
          </Link>
          <i className="fa-solid fa-cart-shopping"></i>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
