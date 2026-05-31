const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  count: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  isPriceChanged: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('CartPlaceholder', cartItemSchema);
