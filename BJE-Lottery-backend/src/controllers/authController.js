const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Registro de usuario
const register = async (req, res) => {
  try {
    let { nombre, email, password, rol, codigoAdmin } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    email = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email no válido" });
    }

    if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres, incluir un número y una letra" });
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/;
    if (!nameRegex.test(nombre)) {
      return res.status(400).json({ message: "El nombre solo puede contener letras y espacios" });
    }

    if (!rol) rol = "usuario";
    if (!["usuario", "admin"].includes(rol)) {
      return res.status(400).json({ message: "Rol no permitido" });
    }

    if (rol === "admin" && codigoAdmin !== process.env.CODIGO_ADMIN) {
      return res.status(403).json({ message: "Código de administrador incorrecto" });
    }

    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ nombre, email, password: hashedPassword, rol });

    res.status(201).json({ message: "Usuario registrado con éxito", newUser });
  } catch (error) {
    console.error("❌ Error en registro:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// Login de usuario
const loginAttempts = {};

const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();
    const now = Date.now();
    const lockDuration = 15 * 60 * 1000;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Formato de email inválido" });
    }

    if (!loginAttempts[email]) {
      loginAttempts[email] = { count: 0, lastAttempt: 0 };
    }

    if (loginAttempts[email].count >= 5) {
      const timeSinceLastAttempt = now - loginAttempts[email].lastAttempt;
      if (timeSinceLastAttempt < lockDuration) {
        const remainingTime = Math.ceil((lockDuration - timeSinceLastAttempt) / 1000);
        return res.status(429).json({ 
          message: `Demasiados intentos fallidos. Intenta de nuevo en ${remainingTime} segundos` 
        });
      } else {
        delete loginAttempts[email];
      }
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      loginAttempts[email].count++;
      loginAttempts[email].lastAttempt = now;
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.estado === "suspendido" || user.estado === "inactivo") {
      return res.status(403).json({ message: "Tu cuenta está inactiva o suspendida" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      loginAttempts[email].count++;
      loginAttempts[email].lastAttempt = now;
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    delete loginAttempts[email];

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ 
      message: "Inicio de sesión exitoso", 
      token, 
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

module.exports = { register, login };
