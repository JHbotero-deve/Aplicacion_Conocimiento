const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

// 1. Configura el pool de pg nativo
const connectionString =
  "postgresql://mi_usuario_postgres:mi_contraseña_segura@localhost:5432/proyecto_ganaderia_db?schema=public";
const pool = new Pool({ connectionString });

// 2. Crea el adaptador
const adapter = new PrismaPg(pool);

// 3. Pasa el adaptador al constructor
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const usuarios = await prisma.usuario.findMany();
    console.log("✅ Conectado con Prisma (Adaptador pg). Usuarios:", usuarios);
  } catch (err) {
    console.error("❌ Error en la consulta:", err.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
