const Category = require('../models/category.model');
const AppError = require('../utilites/appError.uti');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ status: 'success', data: { categories } });
  } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json({ status: 'success', data: { category: newCategory } });
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });
    res.status(200).json({ status: 'success', data: { category } });
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
