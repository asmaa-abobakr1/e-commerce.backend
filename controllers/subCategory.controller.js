const SubCategory = require('../models/subCategory.model');
const AppError = require('../utilites/appError.uti');

exports.getAllSubCategories = async (req, res, next) => {
  try {
    const subCategories = await SubCategory.find().populate('category');
    res.status(200).json({ status: 'success', data: { subcategories: subCategories, subCategories } });
  } catch (err) { next(err); }
};

exports.createSubCategory = async (req, res, next) => {
  try {
    const newSubCategory = await SubCategory.create(req.body);
    res.status(201).json({ status: 'success', data: { subcategory: newSubCategory, subCategory: newSubCategory } });
  } catch (err) { next(err); }
};

exports.updateSubCategory = async (req, res, next) => {
  try {
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
