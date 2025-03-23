import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mssql from "mssql";
import dotenv from "dotenv";
import { generateToken } from "../lib/utils.js"; // Asegúrate de crear esta función para manejar JWT

dotenv.config();

// 📌 Signup (Registro de usuario)
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        let pool = await mssql.connect();
        let result = await pool.request()
            .input("email", mssql.NVarChar, email)
            .query("SELECT Id FROM Users WHERE Email = @email");

        if (result.recordset.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertUser = await pool.request()
            .input("fullName", mssql.NVarChar, fullName)
            .input("email", mssql.NVarChar, email)
            .input("passwordHash", mssql.NVarChar, hashedPassword)
            .query("INSERT INTO Users (Name, Email, PasswordHash) OUTPUT INSERTED.Id VALUES (@fullName, @email, @passwordHash)");

        const userId = insertUser.recordset[0].Id;

        // Generamos el token
        const token = generateToken(userId);

        res.status(201).json({
            _id: userId,
            fullName,
            email,
            profilePic: null, // No tenemos imagen en SQL, puedes agregarlo después
            token
        });
    } catch (error) {
        console.error("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 📌 Login de usuario
export const login = async (req, res) => {
    const { email, password } = req.body;

    console.log("email=" + email + " password=" + password);
    try {
        let pool = await mssql.connect();
        let result = await pool.request()
            .input("email", mssql.NVarChar, email)
            .query("SELECT Id, Name, Email, PasswordHash FROM Users WHERE Email = @email");

        if (result.recordset.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = result.recordset[0];

        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generamos el token
        const token = jwt.sign({ userId: user.Id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        
        console.log("token=" + token);

        // 🔹 Guardar el token en una cookie segura
        res.cookie("jwt", token, {
            httpOnly: true, // Previene accesos desde JavaScript
            secure: false, // Solo en HTTPS en producción
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        });

        res.status(200).json({
            _id: user.Id,
            fullName: user.Name,
            email: user.Email,
            profilePic: null, 
            token, // Opcional si también quieres enviarlo en el JSON
        });
    } catch (error) {
        console.error("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// 📌 Logout (Eliminar JWT del cliente)
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 📌 Actualizar perfil (Imagen de perfil)
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user.userId;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        let pool = await mssql.connect();
        await pool.request()
            .input("id", mssql.Int, userId)
            .input("profilePic", mssql.NVarChar, profilePic)
            .query("UPDATE Users SET ProfilePic = @profilePic WHERE Id = @id");

        res.status(200).json({ message: "Profile updated successfully", profilePic });
    } catch (error) {
        console.error("Error in update profile:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 📌 Verificar autenticación
export const checkAuth = async (req, res) => {
    try {
        const userId = req.user.userId;

        let pool = await mssql.connect();
        let result = await pool.request()
            .input("id", mssql.Int, userId)
            .query("SELECT Id, Name AS fullName, Email FROM Users WHERE Id = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
