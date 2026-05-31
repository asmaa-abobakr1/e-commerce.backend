const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user'],
  },
  products: [{
    product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
    price: { type: Number, required: true }, 
    count: { type: Number, default: 1 }
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  address: {
    type: String, 
    required: [true, 'Order must have a shipping address'],
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'shipped', 'delivered', 'refused', 'cancelbyuser', 'canceledbyadmin'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cash'],
    default: 'cash',
  },
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'rejected'],
    default: 'none',
  },
  orderAt: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

orderSchema.pre(/^find/, function() {
  this.find({ isDeleted: { $ne: true } });
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
