const SubCategory = require('../models/subCategory.model');
const AppError = require('../utilites/appError.uti');
const cloudinary = require('cloudinary').v2;

// إعدادات Cloudinary لتقرأ من الـ Environment Variables في Vercel
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.getAllSubCategories = async (req, res, next) => {
  try {
    const subCategories = await SubCategory.find().populate('category');
    res.status(200).json({ status: 'success', data: { subcategories: subCategories, subCategories } });
  } catch (err) { next(err); }
};

exports.createSubCategory = async (req, res, next) => {
  try {
    // لو الـ Dashboard باعتة صورة للقسم الفرعي، هنرفعها على Cloudinary فوراً
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'youth_fashion_subcategories' // فولدر خاص بالـ SubCategories
      });
      req.body.img = result.secure_url; // حفظ اللينك الأونلاين الثابت في الداتابيز
    }

    const newSubCategory = await SubCategory.create(req.body);
    res.status(201).json({ status: 'success', data: { subcategory: newSubCategory, subCategory: newSubCategory } });
  } catch (err) { next(err); }
};

exports.updateSubCategory = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'youth_fashion_subcategories'
      });
      req.body.img = result.secure_url;
    }

    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });
    res.status(200).json({ status: 'success', data: { subcategory: subCategory, subCategory } });
  } catch (err) { next(err); }
};

exports.deleteSubCategory = async (req, res, next) => {
  try {
    await SubCategory.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};