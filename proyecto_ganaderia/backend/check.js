require("dotenv").config();
const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");

async function checkSystem() {
  console.log("--- 🔍 INICIANDO DIAGNÓSTICO DE SISTEMA ---");

  // 1. Validar variables de entorno
  const vars = ["DB_USER", "DB_PASSWORD", "DB_NAME", "DB_HOST"];
  vars.forEach((v) => {
    if (!process.env[v]) console.error(`❌ Falta variable: ${v}`);
    else console.log(`✅ ${v} encontrada.`);
  });

  // 2. Probar conexión a BD
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  });

  try {
    await pool.query("SELECT 1");
    console.log("✅ Conexión PostgreSQL exitosa.");

    // 3. Probar Prisma
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log("✅ Prisma Client conectado correctamente.");
    await prisma.$disconnect();
  } catch (e) {
    console.error("❌ Error en conexión:", e.message);
  } finally {
    await pool.end();
    console.log("--- ✅ DIAGNÓSTICO FINALIZADO ---");
  }
}

checkSystem();
