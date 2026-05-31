const Ads = require('../models/ads.model');
const AppError = require('../utilites/appError.uti');
const cloudinary = require('cloudinary').v2;

// إعدادات Cloudinary لتقرأ من الـ Environment Variables في Vercel
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.createMessage = async (req, res, next) => {
  try {  
    // لو الـ Dashboard باعتة صورة للإعلان، هنرفعها على Cloudinary فوراً
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'youth_fashion_ads' // فولدر خاص بصور الإعلانات داخل Cloudinary
      });
      req.body.img = result.secure_url; // حفظ اللينك الأونلاين الثابت في الداتابيز
    }

    const newAd = await Ads.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { message: newAd }
    });
  } catch (err) { next(err); }
};

exports.getAllMessages = async (req, res, next) => {
  try {
    const ads = await Ads.find().sort('-createdAt');
    res.status(200).json({
      status: 'success',
      results: ads.length,
      data: { messages: ads }
    });
  } catch (err) { next(err); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const ad = await Ads.findByIdAndUpdate(req.params.id, { isRead: true }, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!ad) return next(new AppError('No ad found with that ID', 404));
    res.status(200).json({ status: 'success', data: { message: ad } });
  } catch (err) { next(err); }
};

// في حال احتجتِ لتعديل الإعلان والصورة مستقبلاً
exports.updateMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'youth_fashion_ads'
      });
      req.body.img = result.secure_url;
    }

    const ad = await Ads.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!ad) return next(new AppError('No ad found with that ID', 404));
    res.status(200).json({ status: 'success', data: { message: ad } });
  } catch (err) { next(err); }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const ad = await Ads.findByIdAndDelete(req.params.id);
    if (!ad) return next(new AppError('No ad found with that ID', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};