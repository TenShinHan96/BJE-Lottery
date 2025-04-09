const express = require("express");
const { getUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware"); 
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

// 🔒 Obtener todos los usuarios (Solo admin)
router.get("/", authMiddleware, adminMiddleware, getUsers);

// 🔒 Obtener un usuario por ID (Solo admin)
router.get("/:id", authMiddleware, adminMiddleware, getUserById);

// 🔒 Actualizar usuario (Requiere autenticación)
router.put("/:id", authMiddleware, updateUser);

// Eliminar usuario (Solo administradores, no pueden eliminar a otros admins)
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
