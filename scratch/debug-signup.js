const mongoose = require('mongoose');
const User = require('../models/user.model');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const timestamp = Date.now();
    const userData = {
      name: 'Test User',
      phone: '01' + timestamp.toString().slice(-9),
      email: `test${timestamp}@example.com`,
      password: 'password123',
      gender: 'male'
    };

    console.log('Creating user...');
    const user = await User.create(userData);
    console.log('User created successfully:', user._id);
    
    console.log('Testing login...');
    const foundUser = await User.findOne({ phone: userData.phone }).select('+password');
    const isCorrect = await foundUser.correctPassword(userData.password, foundUser.password);
    console.log('Login credentials valid:', isCorrect);

    await User.findByIdAndDelete(user._id);
    console.log('Test user cleaned up');
    
    process.exit(0);
  } catch (err) {
    console.error('ERROR during signup test:');
    console.error(err);
    process.exit(1);
  }
};

test();
