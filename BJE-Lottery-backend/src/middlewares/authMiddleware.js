const jwt = require("jsonwebtoken");
const { User } = require("../models/asociaciones");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(403).json({ message: "Token inválido: sin ID" });
    }

    const usuario = await User.findByPk(decoded.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    req.usuario = usuario; // Ahora disponible en todos los controladores protegidos
    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    res.status(403).json({ message: "Token inválido" });
  }
};

module.exports = authMiddleware;
