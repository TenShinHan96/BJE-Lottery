const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Obtener todos los usuarios (solo accesible por administradores)
const getUsers = async (req, res) => {
  try {
    // Verificar si el usuario autenticado es admin
    if (req.user.rol !== "admin") {
      return res.status(403).json({ message: "Acceso denegado. Solo administradores pueden ver todos los usuarios." });
    }

    // Se excluye la contraseña de la respuesta por seguridad
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json({ message: "Usuarios obtenidos con éxito", users });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Obtener usuario por ID (solo el mismo usuario o un administrador)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario autenticado es admin o el mismo usuario
    if (req.user.rol !== "admin" && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: "Acceso denegado. No tienes permiso para ver este usuario." });
    }

    const user = await User.findByPk(id, { attributes: { exclude: ["password"] } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

// Actualizar usuario (solo el mismo usuario o un administrador)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    let user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario autenticado es admin o el mismo usuario
    if (req.user.rol !== "admin" && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: "Acceso denegado. No tienes permiso para actualizar este usuario." });
    }

    // Solo un administrador puede cambiar roles
    if (rol && req.user.rol !== "admin") {
      return res.status(403).json({ message: "No tienes permiso para cambiar roles." });
    }

    // Validación de formato de email
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Formato de email inválido." });
    }

    // Validación de longitud de contraseña (mínimo 6 caracteres)
    if (password && password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    // Si hay una nueva contraseña, la encripta antes de actualizar
    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    // Se actualizan solo los campos proporcionados
    await user.update({
      nombre: nombre || user.nombre,
      email: email || user.email,
      password: hashedPassword,
      rol: rol || user.rol,
    });

    res.status(200).json({ message: "Usuario actualizado con éxito", user });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// Eliminar usuario (solo administradores, no pueden eliminar a otros administradores)
const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Verificar si el usuario autenticado es admin
      if (req.user.rol !== "admin") {
        return res.status(403).json({ message: "Acceso denegado. Solo administradores pueden eliminar usuarios." });
      }
  
      let user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
  
      // Prevenir que un administrador elimine a otro administrador
      if (user.rol === "admin") {
        return res.status(403).json({ message: "No puedes eliminar a otro administrador." });
      }
  
      await user.destroy();
      res.status(200).json({ message: "Usuario eliminado con éxito." });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ message: "Error al eliminar usuario." });
    }
  };

module.exports = { getUsers, getUserById, updateUser,deleteUser };
