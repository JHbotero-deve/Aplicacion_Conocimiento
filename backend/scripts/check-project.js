const http = require("http");
const { Pool } = require("pg");
require("dotenv").config();

// Configuración DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Función para revisar conexión DB
async function checkDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Conexión DB OK:", result.rows[0].now);
  } catch (err) {
    console.error("❌ Error conexión DB:", err.message);
  }
}

// Función para revisar rutas del servidor
function checkRoute(path, expectedStatus = 200) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${process.env.PORT}${path}`, (res) => {
      if (res.statusCode === expectedStatus) {
        console.log(`✅ Ruta ${path} OK`);
      } else {
        console.error(`❌ Ruta ${path} error:`, res.statusCode, `(esperado ${expectedStatus})`);
      }
      resolve();
    }).on("error", (err) => {
      console.error(`❌ Error al conectar ruta ${path}:`, err.message);
      resolve();
    });
  });
}

// Función principal
async function runChecks() {
  console.log("🔍 Revisando proyecto...");

  // 1. Revisar DB
  await checkDB();

  // 2. Revisar rutas principales
  await checkRoute("/ping");
  await checkRoute("/usuarios");
  await checkRoute("/ganado", 401);

  console.log("✅ Revisión completa.");
}

runChecks();

