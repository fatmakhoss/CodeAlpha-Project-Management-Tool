const express = require('express');
const router = express.Router();
const { getUsers, getUserById, searchUsers } = require('../controllers/userController');
const protect = require('../middleware/protect');

router.use(protect);
router.get('/', getUsers);
router.get('/search', searchUsers);
router.get('/:id', getUserById);

module.exports = router;
