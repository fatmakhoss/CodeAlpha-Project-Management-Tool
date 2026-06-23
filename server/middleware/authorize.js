const { Project } = require('../models');
const asyncHandler = require('./asyncHandler');

const authorize = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const projectId = req.params.projectId || req.body.projectId;
    if (!projectId) {
      return next();
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project',
      });
    }

    if (!roles.includes(member.role)) {
      return res.status(403).json({
        success: false,
        message: `Requires ${roles.join(' or ')} role`,
      });
    }

    req.projectRole = member.role;
    next();
  });
};

module.exports = authorize;
