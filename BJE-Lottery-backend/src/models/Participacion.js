const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Participacion = sequelize.define("Participacion", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rifaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pendiente",
  },
}, {
  tableName: "participaciones",
  timestamps: false
});

module.exports = Participacion;
