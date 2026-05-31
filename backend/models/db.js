const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("❌ Error inesperado en pool PostgreSQL:", err.message);
});

if (String(process.env.DB_EAGER_CHECK || "false").toLowerCase() === "true") {
  pool.query("SELECT 1")
    .then(() => console.log("✅ Conectado a PostgreSQL"))
    .catch((err) => console.error("❌ Error conexión DB:", err.message));
}

module.exports = pool;
