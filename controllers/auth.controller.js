const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utilites/appError.uti');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const signToken = (id, role, name) => {
  return jwt.sign({ id, role, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id, user.role, user.name);
  
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true, 
    sameSite: 'none'
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

exports.signup = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'youth_fashion_users' });
      req.body.avatar = result.secure_url;
    }
    const newUser = await User.create(req.body);
    sendTokenResponse(newUser, 201, res);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return next(new AppError('Please provide phone and password!', 400));
    const user = await User.findOne({ phone }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect phone or password', 401));
    }
    sendTokenResponse(user, 200, res);
  } catch (err) { next(err); }
};