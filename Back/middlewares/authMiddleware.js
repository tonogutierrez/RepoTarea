import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token = req.cookies?.jwt; 

    if (!token) {
        console.log("❌ Token no encontrado en cookies.");
        return res.status(401).json({ error: "No autorizado, token no encontrado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido" });
    }
};
