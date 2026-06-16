const { pool } = require("./db");
const bcrypt = require("bcrypt");

async function main() {
  console.log("🚀 Sembrando datos...");
  try {
    const hash = await bcrypt.hash("1234", 10);
    await pool.query(
      `INSERT INTO usuario (nombre_usuario, contrasena_hash, rol_usuario) 
       VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      ["admin", hash, "admin"],
    );
    console.log("✅ Seed completado.");
  } catch (e) {
    console.error("❌ Error:", e);
  } finally {
    await pool.end();
  }
}
main();
