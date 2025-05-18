

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  wishlist: [
    {
      productId: String,
      title: String,
      image: String,
      price: Number
    }
  ]
});

module.exports = mongoose.model('User', userSchema);