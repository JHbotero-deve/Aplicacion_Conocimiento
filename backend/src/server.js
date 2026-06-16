const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("../models/db");
const auth = require("../middleware/auth");
const usuarios = require("./usuarios");
const ganado = require("./ganado");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/ping", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    return res.json({ status: "ok", time: result.rows[0].now });
  } catch (error) {
    return res.status(500).json({ error: "Error DB", detalle: error.message });
  }
});

// Compatibilidad: endpoint usado por frontend/forms/registro.html
app.post("/usuarios", usuarios.registro);
app.get("/usuarios", usuarios.listar);
app.post("/usuarios/login", usuarios.login);

// Compatibilidad: endpoints legacy en requests.http
app.post("/register", usuarios.registro);
app.post("/login", usuarios.login);

app.post("/ganado", auth, ganado.ingreso);
app.get("/ganado", auth, ganado.listar);
app.put("/ganado/bloquear/:id", auth, ganado.bloquear);
app.get("/ganado/chapeta/:chapeta", auth, ganado.buscarPorChapeta);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "proyecto_ganaderia_backend" });
});

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Servidor corriendo en puerto ${port}`);
  });
}

module.exports = app;
