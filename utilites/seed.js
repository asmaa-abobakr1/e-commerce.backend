const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/category.model');
const Product = require('../models/product.model');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('DB connected for seeding');
  
  
  await Category.deleteMany();
  await Product.deleteMany();

  const cat1 = await Category.create({ title: 'Hoodies', image: 'https://picsum.photos/200/200?random=1' });
  const cat2 = await Category.create({ title: 'T-Shirts', image: 'https://picsum.photos/200/200?random=2' });
  const cat3 = await Category.create({ title: 'Jeans', image: 'https://picsum.photos/200/200?random=3' });

  const products = [
    { title: 'Oversized Blue Hoodie', price: 1200, desc: 'Premium cotton oversized hoodie', img: 'https://picsum.photos/400/500?random=10', stock: 10, category: cat1._id, gender: 'unisex' },
    { title: 'Graphic White Tee', price: 600, desc: 'Streetwear graphic t-shirt', img: 'https://picsum.photos/400/500?random=11', stock: 5, category: cat2._id, gender: 'boys' },
    { title: 'Premium Denim Jeans', price: 20000, desc: 'Exclusive high-end denim collection', img: 'https://picsum.photos/400/500?random=12', stock: 1, category: cat3._id, gender: 'girls' }, 
    { title: 'Streetwear Cargo Pants', price: 1500, desc: 'Utility cargo pants for urban style', img: 'https://picsum.photos/400/500?random=13', stock: 2, category: cat3._id, gender: 'boys' },
    { title: 'Pastel Pink Sweatshirt', price: 1100, desc: 'Soft pastel sweatshirt for winter', img: 'https://picsum.photos/400/500?random=14', stock: 8, category: cat1._id, gender: 'girls' }
  ];

  await Product.insertMany(products);
  console.log('Seeding completed!');
  process.exit();
});
