const pool = require("../models/db");
const bcrypt = require("bcrypt");

async function resetPassword(nombre_usuario, nueva_contrasena) {
  try {
    const hashedPassword = await bcrypt.hash(nueva_contrasena, 10);
    const result = await pool.query(
      "UPDATE usuarios SET contrasena = $1 WHERE nombre_usuario = $2",
      [hashedPassword, nombre_usuario]
    );
    return result.rowCount > 0;
  } catch (err) {
    throw new Error("Error al cambiar la contraseña: " + err.message);
  }
}

module.exports = { resetPassword };
