import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Función para obtener el socket ID de un usuario específico
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Mapa para almacenar los usuarios conectados
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log("🔗 Un usuario se ha conectado:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("✅ Usuario en línea agregado:", userSocketMap); // 🔥 Agregar log
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("🔌 Un usuario se ha desconectado:", socket.id);
    delete userSocketMap[userId];
    console.log("🚫 Usuario eliminado:", userSocketMap); // 🔥 Agregar log
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export { io, app, server };
