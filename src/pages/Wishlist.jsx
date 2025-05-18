import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError("Please log in to view your wishlist.");
      setLoading(false);
      return;
    }

    axios.get('http://localhost:5000/wishlist', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setWishlist(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch wishlist', err);
        setError('Failed to load wishlist.');
        setLoading(false);
      });
  }, [token]);

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/wishlist/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlist(wishlist.filter(item => item.productId !== productId));
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  if (loading) {
    return <p className="not-logged">Loading wishlist...</p>;
  }

  if (error) {
    return <p className="not-logged">{error}</p>;
  }

  return (
    <div className="wishlist-container">
      <h1>Your Wishlist</h1>
      <div className="wishlist-grid">
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          wishlist.map(item => (
            <div className="wishlist-card" key={item.productId}>
              <img
                src={item.image || "https://via.placeholder.com/200"}
                alt={item.title || "No Title"}
              />
              <h4>{item.title || "Untitled"}</h4>
              <h6>{item.price || 0} JOD</h6>
              <div className="wishlist-actions">
                <span className="buy-now">View</span>
                <button onClick={() => removeItem(item.productId)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
