const Ads = require('../models/ads.model');
const AppError = require('../utilites/appError.uti');

exports.createMessage = async (req, res, next) => {
  try {  
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

exports.deleteMessage = async (req, res, next) => {
  try {
    const ad = await Ads.findByIdAndDelete(req.params.id);
    if (!ad) return next(new AppError('No ad found with that ID', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
