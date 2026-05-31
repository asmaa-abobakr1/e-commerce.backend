exports.signup = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'youth_fashion_users'
      });
      req.body.avatar = result.secure_url;
    }

    const newUser = await User.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      role: req.body.role || 'user',
      acceptsEmails: req.body.acceptsEmails || false,
      avatar: req.body.avatar
    });

    const token = signToken(newUser._id, newUser.role, newUser.name);

    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });

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

    // إضافة الـ Cookie أيضاً في الـ Login
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });

    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};