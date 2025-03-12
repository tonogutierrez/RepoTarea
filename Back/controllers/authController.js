const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mssql = require('mssql');
require('dotenv').config();

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Usuario no se pudo autenticar.",
            detail: { general: "Email y contraseña son obligatorios" }
        });
    }

    try {
        let pool = await mssql.connect();
        let result = await pool.request()
            .input('email', mssql.NVarChar, email)
            .query('SELECT Id, Name, Email, PasswordHash FROM Users WHERE Email = @email');

        if (result.recordset.length === 0) {
            return res.status(401).json({
                error: "No autorizado.",
                detail: { general: "Credenciales incorrectas" }
            });
        }

        const user = result.recordset[0];

        // Comparar la contraseña encriptada
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(401).json({
                error: "No autorizado.",
                detail: { general: "Credenciales incorrectas" }
            });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { userId: user.Id, name: user.Name, email: user.Email },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        // Actualizar el campo LastLoginDate
        await pool.request()
            .input('id', mssql.Int, user.Id)
            .input('lastLogin', mssql.DateTime, new Date())
            .query('UPDATE Users SET LastLogin = @lastLogin WHERE Id = @id');

        res.json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
                id: user.Id,
                name: user.Name,
                email: user.Email
            }
        });

    } catch (err) {
        res.status(500).json({
            error: "Error en el servidor",
            detail: err.message
        });
    }
};
