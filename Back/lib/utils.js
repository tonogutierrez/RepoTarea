import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // El token expirará en 7 días
  });

  console.log("generated Token=" + token);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false, // ⚠️ IMPORTANTE: en local debe ser false
    sameSite: "lax", // Permite que las cookies se envíen entre frontend y backend
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
  

  return token;
};
