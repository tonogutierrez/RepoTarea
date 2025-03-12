const express = require('express');
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);
router.post('/', createUser);

module.exports = router;
