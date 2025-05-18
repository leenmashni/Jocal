// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  image: String,

});

module.exports = mongoose.model('Product', productSchema);
