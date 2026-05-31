const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const addressSchema = new mongoose.Schema({
  alias: { type: String, required: true }, 
  details: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  count: { type: Number, default: 1, min: 1 },
  price: { type: Number, required: true, min: 0 }, 
  isPriceChanged: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'User must have a phone number'],
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: 6,
    select: false,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'User must specify gender'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  acceptsEmails: {
    type: Boolean,
    default: false
  },
  addresses: [addressSchema],
  cart: [cartItemSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });


userSchema.pre(/^find/, function() {
  this.find({ isDeleted: { $ne: true } });
});


userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});


userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
