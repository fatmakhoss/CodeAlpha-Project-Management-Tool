const { Board, Project } = require('../models');
const sendResponse = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new board
// @route   POST /api/boards
// @access  Private
const createBoard = asyncHandler(async (req, res) => {
  const { name, description, projectId, columns } = req.body;

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

  const normalizedColumns = Array.isArray(columns)
    ? columns
        .map((column, index) => ({
          name: typeof column.name === 'string' ? column.name.trim() : '',
          order: Number.isFinite(Number(column.order)) ? Number(column.order) : index,
          color: column.color || '#E5E7EB',
        }))
        .filter((column) => column.name)
    : [];

  const board = await Board.create({
    name,
    description,
    project: projectId,
    columns:
      normalizedColumns.length > 0
        ? normalizedColumns
        : [
            { name: 'To Do', order: 0, color: '#EF4444' },
            { name: 'In Progress', order: 1, color: '#F59E0B' },
            { name: 'Done', order: 2, color: '#10B981' },
          ],
  });

  project.boards.push(board._id);
  await project.save();

  sendResponse(res, 201, true, 'Board created successfully', board);
});

// @desc    Get all boards for a project
// @route   GET /api/boards/project/:projectId
// @access  Private
const getBoards = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    return sendResponse(res, 404, false, 'Project not found');
  }

  const member = project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  if (!member) {
    return sendResponse(res, 403, false, 'Not authorized');
  }

  const boards = await Board.find({ project: req.params.projectId })
    .populate({
      path: 'tasks',
      populate: [
        { path: 'assignees', select: 'name email avatar' },
        { path: 'createdBy', select: 'name email' },
      ],
    })
    .sort({ order: 1, createdAt: -1 });

  sendResponse(res, 200, true, 'Boards retrieved successfully', boards);
});

// @desc    Get single board
// @route   GET /api/boards/:id
// @access  Private
const getBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id)
    .populate('project', 'name')
    .populate({
      path: 'tasks',
      populate: [
        { path: 'assignees', select: 'name email avatar' },
        { path: 'createdBy', select: 'name email' },
      ],
    });

  if (!board) {
    return sendResponse(res, 404, false, 'Board not found');
  }

  sendResponse(res, 200, true, 'Board retrieved successfully', board);
});

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private
const updateBoard = asyncHandler(async (req, res) => {
  const { name, description, columns } = req.body;

  const board = await Board.findById(req.params.id);
  if (!board) {
    return sendResponse(res, 404, false, 'Board not found');
  }

  const project = await Project.findById(board.project);
  const member = project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
    return sendResponse(res, 403, false, 'Not authorized');
  }

  board.name = name || board.name;
  board.description = description || board.description;
  if (columns) board.columns = columns;

  await board.save();
  sendResponse(res, 200, true, 'Board updated successfully', board);
});

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    return sendResponse(res, 404, false, 'Board not found');
  }

  const project = await Project.findById(board.project);
  const member = project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
    return sendResponse(res, 403, false, 'Not authorized');
  }

  project.boards = project.boards.filter(
    (b) => b.toString() !== board._id.toString()
  );
  await project.save();
  await board.deleteOne();

  sendResponse(res, 200, true, 'Board deleted successfully');
});

module.exports = {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
};
