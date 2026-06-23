const { User, Project } = require('../models');
const sendResponse = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('name email avatar role createdAt')
    .sort({ name: 1 });

  sendResponse(res, 200, true, 'Users retrieved successfully', users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('name email avatar role createdAt')
    .populate('projects.project', 'name description color');

  if (!user) {
    return sendResponse(res, 404, false, 'User not found');
  }

  sendResponse(res, 200, true, 'User retrieved successfully', user);
});

// @desc    Search users
// @route   GET /api/users/search?q=query
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return sendResponse(res, 400, false, 'Search query is required');
  }

  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ],
  })
    .select('name email avatar role')
    .limit(10);

  sendResponse(res, 200, true, 'Users found', users);
});

module.exports = {
  getUsers,
  getUserById,
  searchUsers,
};
