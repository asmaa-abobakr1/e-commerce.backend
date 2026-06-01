const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const AppError = require('./utilites/appError.uti');
const globalErrorHandler = require('./middelwares/errorHandlar.middleware');

dotenv.config();

connectDB();

const app = express();

// 1. تحديث إعدادات CORS لتكون أكثر دقة
app.use(cors({
  origin: 'https://asmaae-commerce.vercel.app', // ضعي رابط موقعكِ هنا
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 2. إزالة السطر الخاص بالـ uploads محلياً (لأنه سيسبب خطأ على Vercel)
// إذا احتجتِ لرفع صور، يجب الاعتماد كلياً على Cloudinary

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

app.get('/', (req, res) => {
  res.json({ message: "API is running" });
});

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// لا تحتاجي لـ app.listen على Vercel، فالسيرفر يعمل أوتوماتيكياً
module.exports = app;