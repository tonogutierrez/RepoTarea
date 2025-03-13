const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token recibido:", token);

    if (!token) {
        return res.status(401).json({
            error: "Acceso denegado",
            detail: { general: "Token no proporcionado" }
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Agrega los datos del usuario al request
        next();
    } catch (err) {
        return res.status(401).json({
            error: "Acceso denegado",
            detail: { general: "Token inválido o expirado" }
        });
    }
};
