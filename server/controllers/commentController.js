const { Comment, Task, Notification, User } = require('../models');
const sendResponse = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { content, taskId } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    return sendResponse(res, 404, false, 'Task not found');
  }

  const comment = await Comment.create({
    content,
    task: taskId,
    author: req.user._id,
  });

  task.comments.push(comment._id);
  await task.save();

  // Create notifications for assignees
  if (task.assignees && task.assignees.length > 0) {
    await Promise.all(
      task.assignees.map((userId) =>
        Notification.create({
          recipient: userId,
          sender: req.user._id,
          type: 'comment_added',
          title: 'New Comment',
          message: `New comment on "${task.title}"`,
          project: task.project,
          task: task._id,
        })
      )
    );
  }

  await comment.populate('author', 'name email avatar');

  sendResponse(res, 201, true, 'Comment created successfully', comment);
});

// @desc    Get comments for a task
// @route   GET /api/comments/task/:taskId
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ task: req.params.taskId })
    .populate('author', 'name email avatar')
    .sort({ createdAt: -1 });

  sendResponse(res, 200, true, 'Comments retrieved successfully', comments);
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return sendResponse(res, 404, false, 'Comment not found');
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Not authorized to update this comment');
  }

  comment.content = content;
  comment.isEdited = true;
  comment.editedAt = new Date();

  await comment.save();
  await comment.populate('author', 'name email avatar');

  sendResponse(res, 200, true, 'Comment updated successfully', comment);
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return sendResponse(res, 404, false, 'Comment not found');
  }

  const task = await Task.findById(comment.task);
  if (
    comment.author.toString() !== req.user._id.toString() &&
    task.createdBy.toString() !== req.user._id.toString()
  ) {
    return sendResponse(res, 403, false, 'Not authorized to delete this comment');
  }

  task.comments = task.comments.filter(
    (c) => c.toString() !== comment._id.toString()
  );
  await task.save();
  await comment.deleteOne();

  sendResponse(res, 200, true, 'Comment deleted successfully');
});

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
