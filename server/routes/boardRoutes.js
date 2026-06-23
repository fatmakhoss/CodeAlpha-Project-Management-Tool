const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
} = require('../controllers/boardController');
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');

const boardValidation = [
  body('name').trim().notEmpty().withMessage('Board name is required'),
  body('projectId').notEmpty().withMessage('Project ID is required'),
];

router.use(protect);
router.post('/', validate(boardValidation), createBoard);
router.get('/project/:projectId', getBoards);
router.get('/:id', getBoard);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

module.exports = router;
