import express from "express";
import cors from "cors";
import mssql from "mssql";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import fs from "fs";
import cookieParser from "cookie-parser"; 
import path from "path";
import { app, server } from "./lib/socket.js";  
import { connectDB } from "./config/db.js";  
import http from "http";

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/login.js";
import messageRoutes from "./routes/message.routes.js"; 

dotenv.config();

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "50mb" })); // Aumenta el límite a 50MB
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser()); 

// Configuración CORS (ahora más completa)
app.use(
  cors({
    origin: "http://localhost:5173", // URL del frontend
    credentials: true, 
  })
);

// ✅ IMPORTANTE: Manejar solicitudes preflight correctamente
app.options("*", cors()); 

app.use(morgan("dev"));

// Conectar a la base de datos
connectDB().catch((err) => console.error("❌ Error conectando a SQL Server:", err));

// Usar rutas
app.use("/users", userRoutes);
app.use("/auth", authRoutes); 
app.use("/messages", messageRoutes);

// Documentación con Swagger
const swaggerPath = path.join(path.resolve(), "swagger.json");
if (fs.existsSync(swaggerPath)) {
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log("📄 Swagger disponible en: http://localhost:3000/api-docs");
} else {
    console.warn("⚠️ Swagger no encontrado. Asegúrate de tener `swagger.json` en la raíz.");
}

// Iniciar servidor con WebSockets
server.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
