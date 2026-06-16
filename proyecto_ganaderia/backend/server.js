require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// 1. Configuración de conexión centralizada
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// 2. Inicialización de Prisma con adaptador
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(express.json());

// 3. Auditoría inicial de conexión
(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ Conexión a Base de Datos establecida.");
  } catch (err) {
    console.error("❌ Error conectando a BD:", err.message);
    process.exit(1);
  }
})();

// 4. Importación de rutas (Asegúrate de que los archivos existan)
const authRoutes = require("./routes/authRoutes");
const ganadoRoutes = require("./routes/ganadoRoutes");

app.use("/auth", authRoutes);
app.use("/ganado", ganadoRoutes);

// 5. Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

// Manejo de cierre elegante
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
});
