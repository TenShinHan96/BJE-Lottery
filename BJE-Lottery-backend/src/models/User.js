const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM("admin", "usuario"),
    defaultValue: "usuario",
  },
}, {
  hooks: {
    // ❌ Este hook estaba volviendo a hashear la contraseña, coméntalo o elimínalo
    // beforeCreate: async (user) => {
    //   const salt = await bcrypt.genSalt(10);
    //   user.password = await bcrypt.hash(user.password, salt);
    // }
  }
});


module.exports = User;
