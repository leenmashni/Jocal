
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('../middleware/auth');
const User = require('../models/users');

// Add CORS and JSON parsing if this router is used standalone (usually unnecessary here)
// These are typically used in `server.js`, not in route files

// POST /wishlist/add
router.post('/add', auth, async (req, res) => {
  const { productId, title, image, price } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const exists = user.wishlist.find(item => item.productId.toString() === productId);
    if (exists) return res.status(400).json({ message: 'Product already in wishlist' });

    user.wishlist.push({ productId, title, image, price });
    await user.save();
    res.status(200).json({ message: 'Product added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /wishlist
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// DELETE /wishlist/remove/:productId
router.delete('/remove/:productId', auth, async (req, res) => {
  const { productId } = req.params;
  try {
    const user = await User.findById(req.userId);
    user.wishlist = user.wishlist.filter(item => item.productId.toString() !== productId);
    await user.save();
    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
