const bcrypt = require("bcrypt");
const pool = require("./models/db");

/**
 * Script de inicialización de datos (Seeding)
 * Crea un usuario administrador por defecto si no existe.
 */
async function seed() {
  try {
    const nombre_usuario = "admin";
    const contrasena = "admin123";
    const rol_usuario = "admin";

    // Verificar si el usuario ya existe
    const res = await pool.query("SELECT * FROM usuarios WHERE nombre_usuario = $1", [nombre_usuario]);

    if (res.rows.length === 0) {
      const hash = await bcrypt.hash(contrasena, 10);
      await pool.query(
        "INSERT INTO usuarios (nombre_usuario, contrasena_hash, rol_usuario, fecha_creacion) VALUES ($1, $2, $3, NOW())",
        [nombre_usuario, hash, rol_usuario]
      );
      console.log("✅ Semilla ejecutada: Usuario 'admin' creado exitosamente.");
    } else {
      console.log("ℹ️ El usuario 'admin' ya existe en la base de datos.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error al ejecutar la semilla:", error);
    process.exit(1);
  }
}

seed();
