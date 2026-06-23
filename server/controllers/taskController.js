const { Task, Board, Project, User, Notification } = require('../models');
const sendResponse = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    boardId,
    projectId,
    column,
    priority,
    dueDate,
    assignees,
    labels,
  } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return sendResponse(res, 404, false, 'Project not found');
  }

  const member = project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  if (!member) {
    return sendResponse(res, 403, false, 'Not authorized');
  }

  const task = await Task.create({
    title,
    description,
    board: boardId,
    project: projectId,
    column: column || 'To Do',
    priority: priority || 'medium',
    dueDate: dueDate ? new Date(dueDate) : null,
    assignees: assignees || [],
    labels: labels || [],
    createdBy: req.user._id,
    activityLog: [
      {
        action: 'created',
        performedBy: req.user._id,
        details: `Task created by ${req.user.name}`,
      },
    ],
  });

  // Add task to board
  await Board.findByIdAndUpdate(boardId, {
    $push: { tasks: task._id },
  });

  // Create notifications for assignees
  if (assignees && assignees.length > 0) {
    await Promise.all(
      assignees.map((userId) =>
        Notification.create({
          recipient: userId,
          sender: req.user._id,
          type: 'task_assigned',
          title: 'New Task Assigned',
          message: `You have been assigned to "${title}"`,
          project: projectId,
          task: task._id,
        })
      )
    );
  }

  await task.populate([
    { path: 'assignees', select: 'name email avatar' },
    { path: 'createdBy', select: 'name email' },
  ]);

  sendResponse(res, 201, true, 'Task created successfully', task);
});

// @desc    Get tasks for a board
// @route   GET /api/tasks/board/:boardId
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.boardId);
  if (!board) {
    return sendResponse(res, 404, false, 'Board not found');
  }

  const project = await Project.findById(board.project);
  const member = project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  if (!member) {
    return sendResponse(res, 403, false, 'Not authorized');
  }

  const tasks = await Task.find({ board: req.params.boardId })
    .populate('assignees', 'name email avatar')
    .populate('createdBy', 'name email')
    .populate('comments')
    .sort({ order: 1, createdAt: -1 });

  sendResponse(res, 200, true, 'Tasks retrieved successfully', tasks);
});

// @desc    Get pending tasks due today for current user's accessible projects
// @route   GET /api/tasks/due-today
// @access  Private
const getTasksDueToday = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const query = {
    dueDate: {
      $gte: startOfToday,
      $lt: endOfToday,
    },
    status: { $ne: 'done' },
  };

  if (req.user.role !== 'admin') {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
    }).select('_id');

    query.project = { $in: projects.map((project) => project._id) };
  }

  const tasks = await Task.find(query)
    .populate('assignees', 'name email avatar')
    .populate('createdBy', 'name email')
    .populate('project', 'name color')
    .populate('board', 'name')
    .sort({ dueDate: 1, priority: -1, createdAt: -1 });

  sendResponse(res, 200, true, 'Tasks due today retrieved successfully', tasks);
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignees', 'name email avatar')
    .populate('createdBy', 'name email')
    .populate({
      path: 'comments',
      populate: { path: 'author', select: 'name email avatar' },
    })
    .populate('project', 'name')
    .populate('board', 'name');

  if (!task) {
    return sendResponse(res, 404, false, 'Task not found');
  }

  sendResponse(res, 200, true, 'Task retrieved successfully', task);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    column,
    priority,
    status,
    dueDate,
    assignees,
    labels,
    order,
  } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) {
    return sendResponse(res, 404, false, 'Task not found');
  }

  const project = await Project.findById(task.project);
  const member = project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  if (!member) {
    return sendResponse(res, 403, false, 'Not authorized');
  }

  const oldColumn = task.column;

  task.title = title || task.title;
  task.description = description || task.description;
  task.column = column || task.column;
  task.priority = priority || task.priority;
  task.status = status || task.status;
  task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
  task.assignees = assignees || task.assignees;
  task.labels = labels || task.labels;
  if (order !== undefined) task.order = order;

  // Log column change
  if (column && column !== oldColumn) {
    task.activityLog.push({
      action: 'moved',
      performedBy: req.user._id,
      details: `Moved from "${oldColumn}" to "${column}"`,
    });
  }

  // Log update
  task.activityLog.push({
    action: 'updated',
    performedBy: req.user._id,
    details: `Task updated by ${req.user.name}`,
  });

  await task.save();
  await task.populate([
    { path: 'assignees', select: 'name email avatar' },
    { path: 'createdBy', select: 'name email' },
  ]);

  sendResponse(res, 200, true, 'Task updated successfully', task);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return sendResponse(res, 404, false, 'Task not found');
  }

  const project = await Project.findById(task.project);
  const member = project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
    return sendResponse(res, 403, false, 'Not authorized');
  }

  await Board.findByIdAndUpdate(task.board, {
    $pull: { tasks: task._id },
  });

  await task.deleteOne();
  sendResponse(res, 200, true, 'Task deleted successfully');
});

// @desc    Move task to different column
// @route   PUT /api/tasks/:id/move
// @access  Private
const moveTask = asyncHandler(async (req, res) => {
  const { column, order } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) {
    return sendResponse(res, 404, false, 'Task not found');
  }

  const oldColumn = task.column;
  task.column = column;
  task.order = order !== undefined ? order : task.order;

  task.activityLog.push({
    action: 'moved',
    performedBy: req.user._id,
    details: `Moved from "${oldColumn}" to "${column}"`,
  });

  await task.save();
  await task.populate('assignees', 'name email avatar');

  sendResponse(res, 200, true, 'Task moved successfully', task);
});

module.exports = {
  createTask,
  getTasks,
  getTasksDueToday,
  getTask,
  updateTask,
  deleteTask,
  moveTask,
};
