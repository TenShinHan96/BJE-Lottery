require("dotenv").config();
const { testConnection } = require("./src/config/database");

testConnection(); // Probar conexión al iniciar el servidor

// 👇 Importar asociaciones antes de usar modelos o sincronizar
require("./src/models/asociaciones");

const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const rifaRoutes = require("./src/routes/rifaRoutes");
const participacionRoutes = require("./src/routes/participacionRoutes");

// Usar las rutas en el orden correcto
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rifas", rifaRoutes);
app.use("/api/participaciones", participacionRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Bienvenido a BJE Lottery API");
});
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
      console.log(`Ruta registrada: ${middleware.route.path}`);
  }
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// 👇 Sincronización de modelos después de definir relaciones
const { sequelize } = require("./src/config/database");

sequelize.sync({ force: false }) // ⚠️ Usa true solo si deseas recrear tablas
  .then(() => console.log("✅ Base de datos sincronizada"))
  .catch((error) => console.error("❌ Error al sincronizar la base de datos:", error));
