const User = require('../models/user.model');
const AppError = require('../utilites/appError.uti');

const normalizeCart = (cart = []) => {
  if (!Array.isArray(cart)) return [];

  return cart
    .map((item) => {
      const product = item.product && (item.product._id || item.product.id || item.product);

      return {
        product,
        count: Math.max(Number(item.count) || 1, 1),
        price: Math.max(Number(item.price ?? item.product?.price ?? 0) || 0, 0),
        isPriceChanged: Boolean(item.isPriceChanged)
      };
    })
    .filter((item) => item.product);
};

exports.getMe = async (req, res, next) => {
  try {
    console.log('Fetching profile for user ID:', req.user.id);
    const user = await User.findById(req.user.id).populate('cart.product');
    console.log('User found:', !!user);
    if (!user) return next(new AppError('No user found with that ID', 404));
    
    
    let isChanged = false;
    user.cart = user.cart.filter(item => {
      if (!item.product) {
        isChanged = true;
        return false;
      }
      return true;
    });

    user.cart.forEach(item => {
      if (item.product && item.product.price !== item.price) {
        item.isPriceChanged = true;
        isChanged = true;
      }
    });

    if (isChanged) {
      await user.save();
    }

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};

exports.updateMe = async (req, res, next) => {
  try {
    
    const filteredBody = { ...req.body };
    delete filteredBody.password;
    delete filteredBody.role;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      returnDocument: 'after',
      runValidators: true
    });

    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  } catch (err) { next(err); }
};

exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.push(req.body);
    
    
    if (user.addresses.length === 1) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    res.status(200).json({ status: 'success', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
};

exports.setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === req.params.id;
    });
    await user.save();
    res.status(200).json({ status: 'success', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();
    res.status(200).json({ status: 'success', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
};

exports.updateCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError('No user found with that ID', 404));

    user.cart = normalizeCart(req.body.cart);
    await user.save();
    await user.populate('cart.product');

    res.status(200).json({ status: 'success', data: { cart: user.cart } });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!user) return next(new AppError('No user found with that ID', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};


exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.status(200).json({ status: 'success', data: { users } });
  } catch (err) { next(err); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('No user found with that ID', 404));
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ status: 'success', data: { user: newUser } });
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!user) return next(new AppError('No user found with that ID', 404));
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};
