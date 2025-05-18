import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Shop.css';

const Search = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [price, setPrice] = useState(250);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const scrollY = sessionStorage.getItem("shopScrollY");
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY));
    }
  }, []);

  const handleImageClick = (id) => {
    sessionStorage.setItem("shopScrollY", window.scrollY.toString());
    navigate(`/item/${id}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filtering is handled live, but we can optionally navigate to /shop
    // with search query if needed for routing or analytics
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.title || '').toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes("All Products") ||
      selectedCategories.includes(product.category);
    const matchesPrice = Number(product.price) <= Number(price);
    const matchesRating = Number(product.rating || 0) >= Number(selectedRating);

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  return (
    <div>
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
            <a href="/">Home</a>
            <a href="#">Deals</a>
            <a href="/contact">Contact</a>
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

      <section className="search-hero">
        <div className="search-hero-content">
          <h1>Give All You Need</h1>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search on Jocal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </section>

      <div className="product-wrapper">
        <section className="search-results">
          <aside className="sidebar">
            <h3>Filter</h3>
            <div className="filter-group">
              <h4>Category</h4>
              <ul>
                {['All Products', 'For Home', 'For Music', 'For Storage'].map((category) => (
                  <li key={category}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => setSelectedCategories((prev) =>
                        prev.includes(category)
                          ? prev.filter((cat) => cat !== category)
                          : [...prev, category]
                      )}
                    />
                    {category}
                  </li>
                ))}
              </ul>
            </div>
            <div className="filter-group">
              <h4>Price</h4>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <p>Up to: <span id="priceValue">{`$${price}`}</span></p>
            </div>
            <div className="filter-group">
              <h4>Review</h4>
              <div className="star-filter" id="starFilter">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <span
                    key={rating}
                    className={selectedRating >= rating ? "selected" : ""}
                    onClick={() => setSelectedRating(rating)}
                    style={{ cursor: "pointer", color: selectedRating >= rating ? "#f5b50a" : "#ccc" }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <div className="product-grid">
            {filteredProducts.length > 0 &&
              filteredProducts.map((product) => (
                <div className="product-card" key={product._id}>
                  <img
                    src={(product.image || "").replace("{width}", "300")}
                    alt={product.title}
                    onClick={() => handleImageClick(product._id)}
                    style={{ cursor: "pointer" }}
                  />
                  <h4>{product.title}</h4>
                  <h6>{product.brand}</h6>
                  <p><strong>{product.price} JOD</strong></p>
                  <div className="product-actions">
                    <span className="buy-now" onClick={() => handleImageClick(product._id)}>View</span>
                    <button className="wishlist-btn">
                      <i className="fa-regular fa-heart"></i>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Search;
