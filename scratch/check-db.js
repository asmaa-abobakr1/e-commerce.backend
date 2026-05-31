const mongoose = require('mongoose');
const Product = require('../models/product.model');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/youthstore').then(async () => {
  const query = { price: { $gte: 0, $lte: 1000 } };
  console.log('Query:', JSON.stringify(query));
  const products = await Product.find(query);
  console.log('Results:', products.length);
  products.forEach(p => console.log(`- ${p.title} (${p.price})`));
  process.exit(0);
});
