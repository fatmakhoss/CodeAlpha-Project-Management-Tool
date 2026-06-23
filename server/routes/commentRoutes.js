const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');

const commentValidation = [
  body('content').trim().notEmpty().withMessage('Comment content is required'),
  body('taskId').notEmpty().withMessage('Task ID is required'),
];

router.use(protect);
router.post('/', validate(commentValidation), createComment);
router.get('/task/:taskId', getComments);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;
