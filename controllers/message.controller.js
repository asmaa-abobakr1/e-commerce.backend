const Message = require('../models/message.model');
const AppError = require('../utilites/appError.uti');

exports.createMessage = async (req, res, next) => {
  try {
    const newMessage = await Message.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { message: newMessage }
    });
  } catch (err) { next(err); }
};

exports.getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: { messages }
    });
  } catch (err) { next(err); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!message) return next(new AppError('No message found with that ID', 404));
    res.status(200).json({ status: 'success', data: { message } });
  } catch (err) { next(err); }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return next(new AppError('No message found with that ID', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
