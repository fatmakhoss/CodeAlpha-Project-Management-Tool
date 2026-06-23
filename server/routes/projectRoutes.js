const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  inviteMember,
  removeMember,
  updateMemberRole,
} = require('../controllers/projectController');
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');

const projectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
];

router.use(protect);
router.post('/', validate(projectValidation), createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/invite', inviteMember);
router.delete('/:id/members/:userId', removeMember);
router.put('/:id/members/:userId/role', updateMemberRole);

module.exports = router;
