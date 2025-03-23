import mssql from "mssql";
import dbConfig from "../config/db.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// ✅ Obtener Usuarios para la Sidebar
export const getUsersForSidebar = async (req, res) => {
    try {
        console.log("Usuario autenticado:", req.user);
        const userId = req.user.userId;
        let pool = await mssql.connect(dbConfig);
        let result = await pool.request()
            .input("userId", mssql.Int, userId)
            .query("SELECT Id, Name, Email, ProfilePic FROM Users WHERE Id <> @userId");

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error en getUsersForSidebar:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// ✅ Obtener Mensajes entre dos Usuarios
export const getMessages = async (req, res) => {
    try {
        console.log("Petición recibida en getMessages");  //Verifica si esta función se ejecuta

        const { id: userToChatId } = req.params;
        const myId = req.user?.userId;  // Asegurar que no sea undefined y también accedemos al id del usuario "conectado"


        if (!myId || !userToChatId) {
            console.error("Faltan parámetros en getMessages");
            return res.status(400).json({ error: "Parámetros incorrectos" });
        }

        let pool = await mssql.connect(dbConfig);
        let result = await pool.request()
            .input("myId", mssql.Int, myId)
            .input("userToChatId", mssql.Int, userToChatId)
            .query(`
                SELECT * FROM Messages 
                WHERE (SenderId = @myId AND ReceiverId = @userToChatId)
                   OR (SenderId = @userToChatId AND ReceiverId = @myId)
                ORDER BY Timestamp ASC
            `);

        console.log("Mensajes encontrados:", result.recordset);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error en getMessages:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


// Enviar Mensaje con Cloudinary y Socket.io
export const sendMessage = async (req, res) => {
    try {
        console.log("📥 Petición recibida en sendMessage");

        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user?.userId;  // Asegurar que `req.user` no es undefined

        console.log("👤 Usuario autenticado (senderId):", senderId);
        console.log("📩 Usuario receptor (receiverId):", receiverId);
        console.log("📨 Mensaje:", text);
        console.log("🖼 Imagen:", image ? "Sí" : "No");

        let imageUrl = null;

        // 🔹 Subir imagen a Cloudinary si existe
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
                console.log("✅ Imagen subida a Cloudinary:", imageUrl);
            } catch (cloudinaryError) {
                console.error("❌ Error subiendo imagen a Cloudinary:", cloudinaryError);
                return res.status(500).json({ error: "Error subiendo imagen" });
            }
        }

        // 🔹 Guardar mensaje en la base de datos
        let pool = await mssql.connect(dbConfig);
        await pool.request()
            .input("SenderId", mssql.Int, senderId)
            .input("ReceiverId", mssql.Int, receiverId)
            .input("MessageText", mssql.NVarChar(mssql.MAX), text)
            .input("ImageUrl", mssql.NVarChar(255), imageUrl)
            .input("Timestamp", mssql.DateTime, new Date())
            .query(`
                INSERT INTO Messages (SenderId, ReceiverId, MessageText, ImageUrl, Timestamp)
                VALUES (@SenderId, @ReceiverId, @MessageText, @ImageUrl, @Timestamp)
            `);

        // 🔹 Obtener el mensaje recién insertado desde la BD
        const savedMessage = await pool.request()
            .input("SenderId", mssql.Int, senderId)
            .input("ReceiverId", mssql.Int, receiverId)
            .query(`
                SELECT TOP 1 * FROM Messages 
                WHERE SenderId = @SenderId AND ReceiverId = @ReceiverId 
                ORDER BY Timestamp DESC
            `);

        const newMessage = savedMessage.recordset[0];

        console.log("📡 Emitiendo mensaje en tiempo real:", newMessage);

        // 🔹 Emitir mensaje en tiempo real con Socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage); // 🔥 Devuelve el mensaje guardado en la BD

    } catch (error) {
        console.error("❌ Error en sendMessage:", error);
        res.status(500).json({ error: "Error interno del servidor", detail: error.message });
    }
};


