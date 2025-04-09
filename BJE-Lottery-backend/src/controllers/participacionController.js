const { Participacion, Rifa } = require("../models/asociaciones");
const User = require("../models/User");

// 📌 Ver números disponibles para una rifa
const getNumerosDisponibles = async (req, res) => {
  try {
    const { rifaId } = req.params;

    const rifa = await Rifa.findByPk(rifaId);
    if (!rifa) {
      return res.status(404).json({ message: "Rifa no encontrada" });
    }

    const participaciones = await Participacion.findAll({
      where: { rifaId },
      attributes: ["numero"],
    });

    const numerosOcupados = participaciones.map(p => p.numero);
    const todosLosNumeros = Array.from({ length: rifa.cantidad_numeros }, (_, i) => i + 1);
    const disponibles = todosLosNumeros.filter(n => !numerosOcupados.includes(n));

    res.status(200).json({ disponibles });
  } catch (error) {
    console.error("Error al obtener los números disponibles:", error);
    res.status(500).json({ message: "Error al obtener los números disponibles" });
  }
};

// 📌 Participar en una rifa (requiere login)
const participarEnRifa = async (req, res) => {
  try {
    const { rifaId } = req.params;
    const { numero } = req.body;
    const userId = req.usuario.id;

    console.log("Datos recibidos:", { rifaId, numero, userId });

    const rifa = await Rifa.findByPk(rifaId);
    if (!rifa) {
      return res.status(404).json({ message: "Rifa no encontrada" });
    }

    if (!numero || !Number.isInteger(numero)) {
      return res.status(400).json({ message: "Debe seleccionar un número válido" });
    }

    if (numero < 1 || numero > rifa.cantidad_numeros) {
      return res.status(400).json({ message: `El número debe estar entre 1 y ${rifa.cantidad_numeros}` });
    }

    const yaExiste = await Participacion.findOne({ where: { rifaId, numero } });
    if (yaExiste) {
      return res.status(409).json({ message: "Ese número ya fue elegido" });
    }

    const nuevaParticipacion = await Participacion.create({
      usuarioId: userId,
      rifaId,
      numero,
    });

    console.log("Participación creada:", nuevaParticipacion);

    res.status(201).json({ message: "Participación registrada con éxito", participacion: nuevaParticipacion });
  } catch (error) {
    console.error("Error al registrar participación:", error);
    res.status(500).json({ message: "Error al registrar participación" });
  }
};

// 📌 Ver participaciones del usuario autenticado
// 📌 Ver participaciones del usuario autenticado
const getMisParticipaciones = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // ✅ req.usuario gracias al middleware

    const participaciones = await Participacion.findAll({
      where: { usuarioId },
      include: [{
        model: Rifa,
        as: "rifa",
        attributes: ["titulo", "descripcion", "fecha_inicio", "fecha_fin"]
      }]
    });

    res.json(participaciones);
  } catch (error) {
    console.error("Error al obtener participaciones:", error);
    res.status(500).json({ message: "Error al obtener participaciones" });
  }
};




module.exports = {
  getNumerosDisponibles,
  participarEnRifa,
  getMisParticipaciones,
};
