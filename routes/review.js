
const express = require('express');
const router = express.Router();
const review = require('../models/review');

// GET reviews by productId
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'username')
      .sort({ createdDate: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

// POST new review
router.post('/', async (req, res) => {
  const { productId, userId, rating, comment } = req.body;

  if (!productId || !userId || !rating || !comment) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newReview = new Review({
      productId,
      userId,
      rating,
      comment,
      createdDate: new Date(),
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post review' });
  }
});

module.exports = router;
