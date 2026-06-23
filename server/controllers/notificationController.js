const { Notification } = require('../models');
const sendResponse = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('sender', 'name email avatar')
    .populate('project', 'name')
    .populate('task', 'title')
    .sort({ createdAt: -1 })
    .limit(50);

  sendResponse(res, 200, true, 'Notifications retrieved successfully', notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    return sendResponse(res, 404, false, 'Notification not found');
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Not authorized');
  }

  notification.isRead = true;
  await notification.save();

  sendResponse(res, 200, true, 'Notification marked as read', notification);
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  sendResponse(res, 200, true, 'All notifications marked as read');
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    return sendResponse(res, 404, false, 'Notification not found');
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Not authorized');
  }

  await notification.deleteOne();
  sendResponse(res, 200, true, 'Notification deleted successfully');
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
