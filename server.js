const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const AppError = require('./utilites/appError.uti');
const globalErrorHandler = require('./middelwares/errorHandlar.middleware');

dotenv.config();


connectDB();

const app = express();


app.use(cors({
  origin: ['https://asmaae-commerce.vercel.app/', 'http://localhost:4200'], 
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use('/api/v1/auth', require('./routes/auth.route'));
app.use('/api/v1/users', require('./routes/user.route'));
app.use('/api/v1/products', require('./routes/product.route'));
app.use('/api/v1/categories', require('./routes/category.route'));
app.use('/api/v1/subcategories', require('./routes/subCategory.route'));
app.use('/api/v1/carts', require('./routes/cart.route'));
app.use('/api/v1/orders', require('./routes/order.route'));
app.use('/api/v1/testimonials', require('./routes/testimonial.route'));
app.use('/api/v1/reports', require('./routes/report.route'));
app.use('/api/v1/settings', require('./routes/settings.route'));
app.use('/api/v1/messages', require('./routes/message.route'));


app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.get('/', (req, res) => {
  res.json({ message: "API is running" });
});

app.use(globalErrorHandler);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}
module.exports = app;