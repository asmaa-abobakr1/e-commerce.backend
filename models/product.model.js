const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product must have a title'], 
    trim: true,
  },
  desc: {
    type: String,
    required: [true, 'Product must have a description'],
  },
  price: {
    type: Number,
    required: [true, 'Product must have a price'],
    min: [0, 'Product price cannot be negative'],
  },
  img: {
    type: String,
    required: [true, 'Product must have an image'],
  },
  stock: {
    type: Number,
    required: [true, 'Product must have stock count'],
    default: 0,
    min: [0, 'Product stock cannot be negative'],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Product must belong to a category'],
  },
  subCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'SubCategory',
  },
  gender: {
    type: String,
    enum: ['girls', 'boys', 'unisex'],
    required: [true, 'Product must have a gender type'],
  },
  season: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.pre(/^find/, function() {
  this.find({ isDeleted: { $ne: true } });
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
