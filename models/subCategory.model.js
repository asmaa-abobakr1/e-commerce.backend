const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'SubCategory must have a title'],
    trim: true,
  },
  category: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'SubCategory must belong to a category'],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

subCategorySchema.pre(/^find/, function() {
  this.find({ isDeleted: { $ne: true } });
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;
