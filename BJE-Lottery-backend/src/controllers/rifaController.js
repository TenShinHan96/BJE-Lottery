const Rifa = require("../models/Rifa");

// 📌 Obtener todas las rifas
const getAllRifas = async (req, res) => {
  try {
    const rifas = await Rifa.findAll();
    res.status(200).json(rifas);
  } catch (error) {
    console.error("Error al obtener las rifas:", error);
    res.status(500).json({ message: "Error al obtener las rifas" });
  }
};

// 📌 Crear una nueva rifa (Solo admin)
const createRifa = async (req, res) => {
  try {
    const { titulo, descripcion, precio, fecha_inicio, fecha_fin, cantidad_numeros } = req.body;

    // 🔹 Validaciones
    if (!titulo || !descripcion || !precio || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (isNaN(precio) || precio <= 0) {
      return res.status(400).json({ message: "El precio debe ser un número válido y mayor a 0" });
    }

    if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
      return res.status(400).json({ message: "La fecha de inicio debe ser anterior a la fecha de fin" });
    }

    let cantidadNumeros = cantidad_numeros || 100; // Valor por defecto
    if (!Number.isInteger(cantidadNumeros) || cantidadNumeros < 10 || cantidadNumeros > 1000) {
      return res.status(400).json({ message: "La cantidad de números debe ser un entero entre 10 y 1,000" });
    }

    const newRifa = await Rifa.create({ 
      titulo, 
      descripcion, 
      precio, 
      fecha_inicio, 
      fecha_fin, 
      cantidad_numeros: cantidadNumeros 
    });

    res.status(201).json({ message: "Rifa creada con éxito", rifa: newRifa });
  } catch (error) {
    console.error("Error al crear la rifa:", error);
    res.status(500).json({ message: "Error al crear la rifa" });
  }
};

// 📌 Obtener una rifa por ID
const getRifaById = async (req, res) => {
  try {
    const rifa = await Rifa.findByPk(req.params.id);
    if (!rifa) {
      return res.status(404).json({ message: "Rifa no encontrada" });
    }
    res.status(200).json(rifa);
  } catch (error) {
    console.error("Error al obtener la rifa:", error);
    res.status(500).json({ message: "Error al obtener la rifa" });
  }
};

// 📌 Eliminar una rifa (Solo admin)
const deleteRifa = async (req, res) => {
  try {
    const { id } = req.params;
    const rifa = await Rifa.findByPk(id);
    if (!rifa) {
      return res.status(404).json({ message: "Rifa no encontrada" });
    }

    await rifa.destroy();
    res.status(200).json({ message: "Rifa eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la rifa:", error);
    res.status(500).json({ message: "Error al eliminar la rifa" });
  }
};

// 📌 Modificar una rifa (Solo admin)
const updateRifa = async (req, res) => {
  try {
    const { titulo, descripcion, precio, fecha_inicio, fecha_fin } = req.body;
    const { id } = req.params;

    const rifa = await Rifa.findByPk(id);
    if (!rifa) {
      return res.status(404).json({ message: "Rifa no encontrada" });
    }

    // Validaciones antes de actualizar
    if (precio && (isNaN(precio) || precio <= 0)) {
      return res.status(400).json({ message: "El precio debe ser un número válido y mayor a 0" });
    }

    if (fecha_inicio && fecha_fin && new Date(fecha_inicio) >= new Date(fecha_fin)) {
      return res.status(400).json({ message: "La fecha de inicio debe ser anterior a la fecha de fin" });
    }

    await rifa.update({ 
      titulo: titulo || rifa.titulo, 
      descripcion: descripcion || rifa.descripcion, 
      precio: precio || rifa.precio, 
      fecha_inicio: fecha_inicio || rifa.fecha_inicio, 
      fecha_fin: fecha_fin || rifa.fecha_fin
    });

    res.status(200).json({ message: "Rifa actualizada con éxito", rifa });
  } catch (error) {
    console.error("Error al actualizar la rifa:", error);
    res.status(500).json({ message: "Error al actualizar la rifa" });
  }
};

module.exports = { getAllRifas, createRifa, getRifaById, deleteRifa, updateRifa };
