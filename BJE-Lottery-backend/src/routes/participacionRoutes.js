const express = require("express");
const router = express.Router();
const {
  getNumerosDisponibles,
  participarEnRifa,
  getMisParticipaciones,
} = require("../controllers/participacionController");

const authMiddleware = require("../middlewares/authMiddleware");

// 📌 Obtener números disponibles para una rifa específica
router.get("/disponibles/:rifaId", getNumerosDisponibles);

// 📌 Participar en una rifa (requiere autenticación)
router.post("/participar/:rifaId", authMiddleware, participarEnRifa);

// 📌 Ver mis participaciones (requiere autenticación)
router.get("/mis-participaciones", authMiddleware, getMisParticipaciones);

module.exports = router;
