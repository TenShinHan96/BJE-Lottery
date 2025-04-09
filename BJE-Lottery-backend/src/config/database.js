const { Sequelize } = require("sequelize");
require("dotenv").config(); // Cargar variables de entorno desde .env

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos
  process.env.DB_USER, // Usuario de la base de datos
  process.env.DB_PASSWORD, // Contraseña de la base de datos
  {
    host: process.env.DB_HOST, // Dirección del servidor de MySQL
    dialect: "mysql",
    logging: false, // Desactiva logs de SQL en la consola
  }
);

// Función para verificar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  }
};


module.exports = { sequelize, testConnection };
