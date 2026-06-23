const { Project, Board, Task, User, Notification } = require('../models');
const sendResponse = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { name, description, color } = req.body;

  const project = await Project.create({
    name,
    description,
    color: color || '#3B82F6',
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'owner' }],
  });

  // Create default board with columns
  const defaultBoard = await Board.create({
    name: 'Main Board',
    description: 'Default project board',
    project: project._id,
    columns: [
      { name: 'To Do', order: 0, color: '#EF4444' },
      { name: 'In Progress', order: 1, color: '#F59E0B' },
      { name: 'Done', order: 2, color: '#10B981' },
    ],
  });

  project.boards.push(defaultBoard._id);
  await project.save();
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { projects: { project: project._id, role: 'owner' } },
  });

  await project.populate('members.user', 'name email avatar');

  sendResponse(res, 201, true, 'Project created successfully', project);
});

// @desc    Get all user projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [
      { owner: req.user._id },
      { 'members.user': req.user._id },
    ],
  })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .populate('boards', 'name')
    .sort({ createdAt: -1 });

  sendResponse(res, 200, true, 'Projects retrieved successfully', projects);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .populate({
      path: 'boards',
      populate: {
        path: 'tasks',
        populate: [
          { path: 'assignees', select: 'name email avatar' },
          { path: 'createdBy', select: 'name email' },
        ],
      },
    });

  if (!project) {
    return sendResponse(res, 404, false, 'Project not found');
  }

  sendResponse(res, 200, true, 'Project retrieved successfully', project);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, color } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    return sendResponse(res, 404, false, 'Project not found');
  }

  const member = project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
    return sendResponse(res, 403, false, 'Not authorized to update this project');
  }

  project.name = name || project.name;
  project.description = description || project.description;
  project.color = color || project.color;

  await project.save();
  await project.populate('members.user', 'name email avatar');

  sendResponse(res, 200, true, 'Project updated successfully', project);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return sendResponse(res, 404, false, 'Project not found');
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Only owner can delete this project');
  }

  // Delete all boards and tasks
  await Board.deleteMany({ project: project._id });
  await Task.deleteMany({ project: project._id });
  await User.updateMany(
    { 'projects.project': project._id },
    { $pull: { projects: { project: project._id } } }
  );
  await project.deleteOne();

  sendResponse(res, 200, true, 'Project deleted successfully');
});

// @desc    Invite member to project
// @route   POST /api/projects/:id/invite
// @access  Private
const inviteMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const memberRole = ['admin', 'member'].includes(role) ? role : 'member';
  const project = await Project.findById(req.params.id);

  if (!project) {
    return sendResponse(res, 404, false, 'Project not found');
  }

  const inviter = project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  if (!inviter || (inviter.role !== 'owner' && inviter.role !== 'admin')) {
    return sendResponse(res, 403, false, 'Not authorized to invite members');
  }

  const user = await User.findOne({ email: email?.trim().toLowerCase() });
  if (!user) {
    return sendResponse(res, 404, false, 'User not found');
  }

  const alreadyMember = project.members.find(
    (m) => m.user.toString() === user._id.toString()
  );
  if (alreadyMember) {
    return sendResponse(res, 400, false, 'User is already a member');
  }

  project.members.push({ user: user._id, role: memberRole });
  await project.save();
  await User.findByIdAndUpdate(user._id, {
    $addToSet: { projects: { project: project._id, role: memberRole } },
  });

  // Create notification
  await Notification.create({
    recipient: user._id,
    sender: req.user._id,
    type: 'project_invite',
    title: 'Project Invitation',
    message: `You have been invited to join ${project.name}`,
    project: project._id,
  });

  await project.populate('members.user', 'name email avatar');

  sendResponse(res, 200, true, 'Member invited successfully', project);
});

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return sendResponse(res, 404, false, 'Project not found');
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Only owner can remove members');
  }

  project.members = project.members.filter(
    (m) => m.user.toString() !== req.params.userId
  );
  await project.save();
  await User.findByIdAndUpdate(req.params.userId, {
    $pull: { projects: { project: project._id } },
  });

  sendResponse(res, 200, true, 'Member removed successfully', project);
});

// @desc    Update member role
// @route   PUT /api/projects/:id/members/:userId/role
// @access  Private
const updateMemberRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'member'].includes(role)) {
    return sendResponse(res, 400, false, 'Invalid member role');
  }

  const project = await Project.findById(req.params.id);

  if (!project) {
    return sendResponse(res, 404, false, 'Project not found');
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Only owner can update roles');
  }

  const member = project.members.find(
    (m) => m.user.toString() === req.params.userId
  );
  if (!member) {
    return sendResponse(res, 404, false, 'Member not found');
  }

  member.role = role;
  await project.save();
  await User.findOneAndUpdate(
    { _id: req.params.userId, 'projects.project': project._id },
    { $set: { 'projects.$.role': role } }
  );
  await project.populate('members.user', 'name email avatar');

  sendResponse(res, 200, true, 'Member role updated successfully', project);
});

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  inviteMember,
  removeMember,
  updateMemberRole,
};
