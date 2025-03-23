import express from "express";
import {
    signup,        // Registrar usuario
    login,         // Iniciar sesión
    logout,        // Cerrar sesión
    updateProfile, // Actualizar perfil
    checkAuth      // Verificar autenticación
} from "../controllers/authController.js";

import { protect } from "../middlewares/authMiddleware.js"; // Middleware para proteger rutas

const router = express.Router();

// 📌 Registro de usuario
router.post("/signup", signup);

// 📌 Iniciar sesión
router.post("/login", login);

// 📌 Cerrar sesión
router.post("/logout", logout);

// 📌 Obtener información del usuario autenticado (protegido con JWT)
router.get("/check", protect, checkAuth);

// 📌 Actualizar perfil del usuario autenticado (protegido con JWT)
router.put("/profile", protect, updateProfile);

export default router;
