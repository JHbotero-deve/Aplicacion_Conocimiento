const express = require("express");
const cors = require("cors");
const pool = require("./models/db");

const app = express();

// ✅ habilitar CORS para tu frontend
app.use(cors({
  origin: "http://localhost:8080",   // autoriza solo tu frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Ruta de prueba para verificar conexión
app.get("/db-check", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "✅ Conexión OK", time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "❌ Error de conexión", error: err.message });
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 8000}`);
});
