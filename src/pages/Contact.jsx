
// src/pages/Contact.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error:', err);
      setStatus('Error sending message.');
    }
  };

  return (
    <div className="contact-container">
      {/* Nav Bar */}
      <header className="main-header">
        <div className="logo-search">
          <Link to="/" className="logo">Jocal</Link>
          <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="search__input"
              placeholder="Search shops, deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="search__button">
              <svg className="search__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M505 442.7L405.3 343a208.1 208.1 0 0044.4-129C449.7 95.7 353.9 0 234.9 0S20.1 95.7 20.1 214.7s95.8 214.7 214.8 214.7c48.6 0 93.2-15.8 129-44.4l99.7 99.7c4.5 4.5 10.4 6.7 16.3 6.7s11.8-2.2 16.3-6.7c9-9 9-23.6 0-32.6zM234.9 378.3c-90.1 0-163.6-73.5-163.6-163.6S144.8 51.1 234.9 51.1s163.6 73.5 163.6 163.6-73.5 163.6-163.6 163.6z" />
              </svg>
            </button>
          </form>
        </div>
        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
        <div className="header-actions">
          <i className="fa-regular fa-user"></i>
          <Link to="/wishlist" title="Wishlist">
            <i className="fa-regular fa-heart"></i>
          </Link>
          <i className="fa-solid fa-cart-shopping"></i>
        </div>
      </header>

      {/* Contact Form */}
      <div className="contact-card">
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <h2>Contact Us</h2>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Send Message</button>
            {status && <p className="status-msg">{status}</p>}
          </form>
        </div>

        <div className="side-panel">
          <div className="panel-overlay"></div>
          <div className="panel-content">
            <h2>Let’s Talk</h2>
            <p>Whether you’re looking to collaborate, grow your reach, or just have a question.<br />Feel free to reach out anytime.</p>
            <a href="tel:+962799991234" className="contact-phone">+962 7 9999 1234</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
