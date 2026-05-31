const Settings = require('../models/settings.model');
const AppError = require('../utilites/appError.uti');
const cloudinary = require('cloudinary').v2;

// إعدادات Cloudinary لتقرأ من الـ Environment Variables في Vercel
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); 
    }
    res.status(200).json({ status: 'success', data: { settings } });
  } catch (err) { next(err); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    
    // التعامل مع رفع الملفات عبر Cloudinary
    if (req.files) {
      
      // 1. رفع الصورة الرئيسية الـ Hero Image (صورة واحدة)
      if (req.files.heroImage && req.files.heroImage[0]) {
        const heroResult = await cloudinary.uploader.upload(req.files.heroImage[0].path, {
          folder: 'youth_fashion_settings'
        });
        updateData.heroImage = heroResult.secure_url;
      }
      
      // 2. رفع مصفوفة الصور التسويقية Marketing Images (ملفات متعددة)
      if (req.files.marketingImages && req.files.marketingImages.length > 0) {
        // بنعمل خريطة (Map) لكل ملف ونرفعه، و Promise.all بتضمن إنهم يترفعوا مع بعض
        const uploadPromises = req.files.marketingImages.map(file => 
          cloudinary.uploader.upload(file.path, { folder: 'youth_fashion_settings' })
        );
        
        const uploadedResults = await Promise.all(uploadPromises);
        
        // استخراج الـ URLs الأونلاين وحفظها في مصفوفة
        updateData.marketingImages = uploadedResults.map(result => result.secure_url);
      }
    }

    // الـ Fallback بتاعك لو الـ Front-end باعت الصور القديمة كـ String مفصول بكومة
    if (typeof updateData.marketingImages === 'string' && (!req.files || !req.files.marketingImages)) {
      updateData.marketingImages = updateData.marketingImages.split(',').map(s => s.trim()).filter(s => s !== '');
    }

    const settings = await Settings.findOneAndUpdate({}, updateData, {
      returnDocument: 'after',
      upsert: true,
      runValidators: true
    });
    
    res.status(200).json({ status: 'success', data: { settings } });
  } catch (err) { next(err); }
};