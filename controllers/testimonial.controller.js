const Testimonial = require('../models/testimonial.model');
const AppError = require('../utilites/appError.uti');

const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.submitTestimonial = async (req, res, next) => {
  try {
    const data = { ...req.body };
    
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        data.user = decoded.id;
      } catch (err) {
        
      }
    }

    const testimonial = await Testimonial.create(data);
    res.status(201).json({ status: 'success', data: { testimonial } });
  } catch (err) { next(err); }
};

exports.getApprovedTestimonials = async (req, res, next) => {
  try {
    
    const testimonials = await Testimonial.find({ isApproved: 1 })
      .populate('user', 'name')
      .sort('-stars -date name');
    res.status(200).json({ status: 'success', data: { testimonials } });
  } catch (err) { next(err); }
};

exports.getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().populate('user', 'name').sort('-createdAt');
    res.status(200).json({ status: 'success', data: { testimonials } });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { isApproved, isFeaturedInSlider } = req.body;
    const updateData = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (isFeaturedInSlider !== undefined) updateData.isFeaturedInSlider = isFeaturedInSlider;

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    res.status(200).json({ status: 'success', data: { testimonial } });
  } catch (err) { next(err); }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
