const mssql = require('mssql');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios (requiere JWT)
exports.getUsers = async (req, res) => {
    try {
        let pool = await mssql.connect();
        let result = await pool.request().query('SELECT * FROM Users');
        res.json({
            message: "Lista de usuarios obtenida correctamente",
            users: result.recordset
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener un usuario por ID (requiere JWT)
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            error: "Error en la solicitud.",
            detail: { id: "El ID es obligatorio" }
        });
    }

    try {
        let pool = await mssql.connect();
        let result = await pool.request()
            .input('id', mssql.Int, id)
            .query('SELECT * FROM Users WHERE Id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                error: "Usuario no encontrado.",
                detail: { id: "No existe un usuario con este ID" }
            });
        }

        res.json({
            message: "Usuario obtenido correctamente",
            user: result.recordset[0]
        });

    } catch (err) {
        res.status(500).json({
            error: "No se pudo obtener el usuario.",
            detail: err.message
        });
    }
};

// Crear usuario (NO requiere JWT)
exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        let pool = await mssql.connect();
        const result = await pool.request()
            .input('name', mssql.NVarChar, name)
            .input('email', mssql.NVarChar, email)
            .input('passwordHash', mssql.NVarChar, hashedPassword)
            .query('INSERT INTO Users (Name, Email, PasswordHash) VALUES (@name, @email, @passwordHash); SELECT SCOPE_IDENTITY() AS Id');

        res.json({ message: "Usuario creado", userId: result.recordset[0].Id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar usuario (requiere JWT)
exports.updateUser = async (req, res) => {
    const { id, name, email } = req.body;

    try {
        let pool = await mssql.connect();
        await pool.request()
            .input('id', mssql.Int, id)
            .input('name', mssql.NVarChar, name)
            .input('email', mssql.NVarChar, email)
            .query('UPDATE Users SET Name=@name, Email=@email WHERE Id=@id');

        res.json({ message: "Usuario actualizado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar usuario (requiere JWT)
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        let pool = await mssql.connect();
        await pool.request()
            .input('id', mssql.Int, id)
            .query('DELETE FROM Users WHERE Id=@id');

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
