const User = require("./User");
const Rifa = require("./Rifa");
const Participacion = require("./Participacion");

// Usuario ↔ Participaciones
User.hasMany(Participacion, {
  foreignKey: "usuarioId",
  as: "participaciones"
});
Participacion.belongsTo(User, {
  foreignKey: "usuarioId",
  as: "usuario"
});

// Rifa ↔ Participaciones
Rifa.hasMany(Participacion, {
  foreignKey: "rifaId",
  as: "participaciones"
});
Participacion.belongsTo(Rifa, {
  foreignKey: "rifaId",
  as: "rifa"
});

module.exports = {
  User,
  Rifa,
  Participacion
};
