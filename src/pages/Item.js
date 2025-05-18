
// src/pages/Item.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

import axios from "axios";
import "../styles/Item.css";

const Item = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviewInput, setReviewInput] = useState("");
  const [reviews, setReviews] = useState([
    { name: "Helen M.", stars: 5, comment: "Excellent item!" },
    { name: "Ann D.", stars: 4, comment: "Looks great and came quickly." },
  ]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };
    fetchProduct();
  }, [id]);

  const addReview = () => {
    if (reviewInput.trim()) {
      setReviews([{ name: "You", stars: 4, comment: reviewInput }, ...reviews]);
      setReviewInput("");
    }
  };

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div>
      <header className="main-navbar">
        <div className="nav-container">
          <div className="logo">JOCAL</div>
          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/shop">Shop</a>
            <a href="#">Deals</a>
            <a href="/contact.html">Contact</a>
          </nav>
          <div className="nav-icons">
            <i className="fa-regular fa-user"></i>
            <Link to="/wishlist" style={{ textDecoration: 'none', color: 'inherit' }}className="wishlist-btn">
              <i className="fa-regular fa-heart"></i>
            </Link>
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
        </div>
      </header>

      <div className="product-page">
        <div className="product-container">
          <div className="product-images">
            <img
              src={product.image.replace("{width}", "300")}
              alt={product.title}
              className="main-image"
            />

            <div className="review-section">
              <h3>Reviews</h3>
              <ul className="review-list">
                {reviews.map((r, index) => (
                  <li key={index}>
                    <strong>{r.name}</strong> – {"\u2605".repeat(r.stars)}<br />
                    {r.comment}
                  </li>
                ))}
              </ul>

              <div className="review-form">
                <textarea
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  placeholder="Write your review..."
                />
                <button onClick={addReview}>Submit</button>
              </div>
            </div>
          </div>

          <div className="product-details">
            <h2>{product.title}</h2>
            <div className="brand">by {product.brand}</div>
            <div className="price">{product.price} JOD</div>
            <div className="description" style={{ margin: "20px 0" }}>
              {product.description
                ?.split(/<\/p>/i)
                .map((para, idx) => {
                  const clean = para
                    .replace(/<[^>]+>/g, '') // Remove any HTML tags
                    .trim();
                  return clean && <p key={idx}>{clean}</p>;
                })}
            </div>


            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i> Visit Original Website
            </a>

            <button className="btn-primary">
              <i className="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;