const Category = require('../models/category.model');
const AppError = require('../utilites/appError.uti');
const cloudinary = require('cloudinary').v2;

// إعدادات Cloudinary لتقرأ من الـ Environment Variables في Vercel
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ status: 'success', data: { categories } });
  } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
  try {
    // لو رفعتِ صورة للقسم من الـ Dashboard، هتترفع هنا أونلاين
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'youth_fashion_categories' // فولدر خاص بصور الأقسام داخل Cloudinary
      });
      req.body.img = result.secure_url; // حفظ اللينك الأونلاين الثابت في الـ Database
    }

    const newCategory = await Category.create(req.body);
    res.status(201).json({ status: 'success', data: { category: newCategory } });
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'youth_fashion_categories'
      });
      req.body.img = result.secure_url;
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });
    res.status(200).json({ status: 'success', data: { category } });
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};