const mongoose = require('mongoose');
const Testimonial = require('../models/testimonial.model');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/youthstore').then(async () => {
  const testimonials = await Testimonial.find();
  console.log('Total testimonials:', testimonials.length);
  testimonials.forEach(t => console.log(`- ${t.user || t.name}: ${t.comment || t.content} (Approved: ${t.isApproved})`));
  process.exit(0);
});
