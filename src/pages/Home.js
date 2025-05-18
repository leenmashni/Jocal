import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="container">
      <header className="main-header">
        <div className="logo-search">
          <h1 className="logo">Jocal</h1>
          <form className="search" role="search">
            <input
              type="text"
              className="search__input"
              placeholder="Search shops, deals..."
              aria-label="Search"
            />
            <button className="search__button" aria-label="Search button">
              <svg className="search__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M505 442.7L405.3 343a208.1 208.1 0 0044.4-129C449.7 95.7 353.9 0 234.9 0S20.1 95.7 20.1 214.7s95.8 214.7 214.8 214.7c48.6 0 93.2-15.8 129-44.4l99.7 99.7c4.5 4.5 10.4 6.7 16.3 6.7s11.8-2.2 16.3-6.7c9-9 9-23.6 0-32.6zM234.9 378.3c-90.1 0-163.6-73.5-163.6-163.6S144.8 51.1 234.9 51.1s163.6 73.5 163.6 163.6-73.5 163.6-163.6 163.6z" />
              </svg>
            </button>
          </form>
        </div>

        <nav className="main-nav">
          <a href="#" className="nav-link">Our Story</a>
          <a href="/login" className="nav-link">Deals</a>
          <a href="/contact" className="nav-link">Contact</a>
        </nav>

        <div className="header-actions">
          <button className="button">Login</button>
          <button className="button">Register</button>
          <a href="#" className="icon-button" title="Profile">
            <img src="" alt="Profile" className="profile-icon" />
          </a>
          <a href="/wishlist" className="icon-button" title="Wishlist">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42
              4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09
              4.01 14.76 3 16.5 3 19.58 3 22 5.42 22
              8.5c0 3.78-3.4 6.86-8.55
              11.54L12 21.35z" />
            </svg>
          </a>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h2>Search, Compare,<br />Shop</h2>
              <p>Welcome to your one-stop destination for exploring local shops in Jordan. Easily compare prices to find the best deals and support your community.</p>
              <div className="hero-buttons">
                <Link to="/shop">
                  <button className="shop-btn">Shop Now</button>
                </Link> {/* Fixing the missing closing tag */}
              </div>
            </div>

            <div className="hero-gallery">
              <div className="column column-up">
                <div className="scroll-track">
                  <img src="https://via.placeholder.com/150x200" alt="Product image 1" />
                  <img src="https://via.placeholder.com/150x200" alt="Product image 2" />
                  <img src="https://via.placeholder.com/150x200" alt="Product image 3" />
                  <img src="https://via.placeholder.com/150x200" alt="Product image 4" />
                </div>
              </div>
              <div className="column column-down">
                <div className="scroll-track">
                  <img src="https://via.placeholder.com/150x200" alt="Product image 5" />
                  <img src="https://via.placeholder.com/150x200" alt="Product image 6" />
                  <img src="https://via.placeholder.com/150x200" alt="Product image 7" />
                  <img src="https://via.placeholder.com/150x200" alt="Product image 8" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="main-categories-section">
          <h2 className="main-categories-title">Explore the best products by category – all in one place.</h2>
          <div className="main-categories-wrapper">
            {['Clothing', 'Cosmetics', 'Electronics', 'Home &Furniture', 'Accessories', 'Shoes'].map((cat, i) => (
              <div className="main-category" key={i}>
                <img src={`https://via.placeholder.com/200?text=${cat}`} alt={`${cat} category`} />
                <p>{cat} <span>→</span></p>
              </div>
            ))}
          </div>
        </section>

        <section className="story-card">
          <div className="card">
            <img src="https://via.placeholder.com/400x300" alt="Local Bookstore in Jordan" className="card-image" />
            <div className="card-content">
              <h2 className="card-title">Our Story Begins Here</h2>
              <p>
                We are committed to helping you find the best deals from local websites and shops in Jordan.
                Our platform offers a comprehensive comparison tool that enables you to make informed purchasing
                decisions, ensuring you get the most out of your budget.
              </p>
              <p className="mission-statement">
                Our mission is to empower and support local businesses, especially in light of recent boycotts,
                by promoting homegrown alternatives and fostering community-driven growth.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
