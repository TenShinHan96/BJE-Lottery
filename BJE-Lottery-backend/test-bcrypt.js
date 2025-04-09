const bcrypt = require("bcryptjs");

const passwordIngresada = "123";
bcrypt.hash(passwordIngresada, 10)
  .then(nuevoHash => console.log("Nuevo hash generado:", nuevoHash))
  .catch(error => console.error("Error al generar hash:", error));


