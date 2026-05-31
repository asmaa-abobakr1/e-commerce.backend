const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utilites/appError.uti');

const signToken = (id, role, name) => {
  return jwt.sign({ id, role, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      role: req.body.role || 'user',
      acceptsEmails: req.body.acceptsEmails || false
    });

    const token = signToken(newUser._id, newUser.role, newUser.name);

    res.status(201).json({
      status: 'success',
      token,
      data: { user: newUser }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return next(new AppError('Please provide phone and password!', 400));
    }

    const user = await User.findOne({ phone }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect phone or password', 401));
    }

    const token = signToken(user._id, user.role, user.name);

    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};
