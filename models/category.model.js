const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Category must have a title'],
    unique: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


categorySchema.pre(/^find/, function() {
  this.find({ isDeleted: { $ne: true } });
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
