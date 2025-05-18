
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/Contact'));
app.use('/api/protected', require('./routes/protected'));
app.use('/api/products', require('./routes/Product'));
app.use('/api/wishlist', require('./routes/Wishlist')); // Optional
app.use('/api/reviews', require('./routes/review'));   // Optional

// DB Connection and Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🌐 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ DB connection error:', err));
