import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.Controller.js";

const router = express.Router();

router.get("/users", protect, getUsersForSidebar);
router.get("/:id", protect, getMessages);

// Ruta para enviar un mensaje
router.post("/send/:id", protect, sendMessage);
export default router;