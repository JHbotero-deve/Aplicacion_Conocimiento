const pool = require("./models/db");
const bcrypt = require("bcrypt");

const seed = async () => {
  try {
    // 🔹 Usuario admin
    const hashAdmin = await bcrypt.hash("1234", 10);
    await pool.query(
      "INSERT INTO usuarios (nombre_usuario, contrasena_hash, rol_usuario, fecha_creacion) VALUES ($1, $2, $3, NOW()) ON CONFLICT (nombre_usuario) DO NOTHING",
      ["admin", hashAdmin, "admin"]
    );

    // 🔹 Usuario normal
    const hashUser = await bcrypt.hash("abcd", 10);
    await pool.query(
      "INSERT INTO usuarios (nombre_usuario, contrasena_hash, rol_usuario, fecha_creacion) VALUES ($1, $2, $3, NOW()) ON CONFLICT (nombre_usuario) DO NOTHING",
      ["usuario1", hashUser, "usuario"]
    );
await pool.query(
  "INSERT INTO ganado (id, chapeta, raza, edad, peso, fecha_ingreso, estadoica, certificado_ica, bloqueado) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
  [1, "CH-001", "Holstein", 5, 450.50, "2026-05-01", "activo", true, false]
);

await pool.query(
  "INSERT INTO ganado (id, chapeta, raza, edad, peso, fecha_ingreso, estadoica, certificado_ica, bloqueado) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
  [2, "CH-002", "Brahman", 3, 600.00, "2026-05-10", "activo", false, false]
);

await pool.query(
  "INSERT INTO ganado (id, chapeta, raza, edad, peso, fecha_ingreso, estadoica, certificado_ica, bloqueado) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
  [3, "CH-003", "Jersey", 2, 200.00, "2026-05-15", "activo", true, false]
);


    console.log("✅ Seed completado: usuarios y ganado insertados");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  }
};

seed();
