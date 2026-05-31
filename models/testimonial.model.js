const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Testimonial must have a name'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Testimonial must have content'],
  },
  stars: {
    type: Number,
    required: [true, 'Testimonial must have a star rating'],
    min: 1,
    max: 5,
  },
  isApproved: {
    type: Number,
    enum: [1, 2, 3], 
    default: 2,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  isFeaturedInSlider: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

testimonialSchema.pre(/^find/, function() {
  this.find({ isDeleted: { $ne: true } });
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
