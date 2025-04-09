const express = require("express");
const {
  getAllRifas,
  createRifa,
  getRifaById,
  deleteRifa,
  updateRifa
} = require("../controllers/rifaController");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Obtener todas las rifas (Disponible para todos)
router.get("/", getAllRifas);

// 📌 Crear una nueva rifa (Solo admin)
router.post("/", authMiddleware, adminMiddleware, createRifa);

// 📌 Obtener una rifa por ID (Disponible para todos)
router.get("/:id", getRifaById);

// 📌 Eliminar una rifa (Solo admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteRifa);

// 📌 Modificar una rifa (Solo admin)
router.put("/:id", authMiddleware, adminMiddleware, updateRifa);

module.exports = router;
