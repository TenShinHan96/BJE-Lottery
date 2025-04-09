const { sequelize } = require("../config/database");
const Rifa = require("./Rifa");
const Participacion = require("./Participacion");

module.exports = { sequelize, Rifa, Participacion };
