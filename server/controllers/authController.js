const bcrypt = require('bcryptjs');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');
const sendResponse = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return sendResponse(res, 400, false, 'User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    sendResponse(res, 201, true, 'User registered successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    sendResponse(res, 400, false, 'Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return sendResponse(res, 401, false, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return sendResponse(res, 401, false, 'Invalid email or password');
  }

  sendResponse(res, 200, true, 'Login successful', {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    token: generateToken(user._id),
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('projects.project', 'name description color')
    .select('-password');

  sendResponse(res, 200, true, 'User retrieved successfully', user);
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  ).select('-password');

  sendResponse(res, 200, true, 'Profile updated successfully', user);
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
