const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  try {
    // Verificar si el usuario ya fue autenticado por el authMiddleware
    if (!req.user) {
      return res.status(401).json({ message: "Acceso no autorizado, usuario no autenticado" });
    }

    // Verificar si el rol es 'admin'
    if (req.user.rol !== "admin") {
      return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador." });
    }

    // Si es admin, continuar con la solicitud
    next();
  } catch (error) {
    console.error("Error en el middleware de administrador:", error);
    res.status(500).json({ message: "Error en el middleware de administrador" });
  }
};

module.exports = adminMiddleware;