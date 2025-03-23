import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.put('/', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.post('/', createUser);

export default router;
