const mongoose = require('mongoose');

const adsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ad must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Ad must have an email'],
    lowercase: true,
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Ad must have a subject'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Ad content cannot be empty'],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Ads = mongoose.model('Ads', adsSchema);
module.exports = Ads;
