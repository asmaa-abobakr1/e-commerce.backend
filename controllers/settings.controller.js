const Settings = require('../models/settings.model');

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
    
    if (req.files) {
      if (req.files.heroImage) {
        updateData.heroImage = `${req.protocol}://${req.get('host')}/uploads/${req.files.heroImage[0].filename}`;
      }
      if (req.files.marketingImages) {
        updateData.marketingImages = req.files.marketingImages.map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);
      }
    }

    
    if (typeof updateData.marketingImages === 'string' && !req.files?.marketingImages) {
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
