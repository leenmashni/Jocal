

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: String,
  //userId: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  comment: String,
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', reviewSchema);