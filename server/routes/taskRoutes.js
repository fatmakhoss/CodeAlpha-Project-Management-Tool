const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  getTasksDueToday,
  getTask,
  updateTask,
  deleteTask,
  moveTask,
} = require('../controllers/taskController');
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('boardId').notEmpty().withMessage('Board ID is required'),
  body('projectId').notEmpty().withMessage('Project ID is required'),
];

router.use(protect);
router.post('/', validate(taskValidation), createTask);
router.get('/due-today', getTasksDueToday);
router.get('/board/:boardId', getTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/move', moveTask);

module.exports = router;
