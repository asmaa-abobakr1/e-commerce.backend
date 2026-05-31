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

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    if (!user) return next(new AppError('No user found with that ID', 404));

    let isChanged = false;
    user.cart = user.cart.filter(item => {
      if (!item.product) {
        isChanged = true;
        return false;
      }
      return true;
    });

    if (isChanged) await user.save();

    res.status(200).json({ status: 'success', data: { cart: user.cart } });
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
