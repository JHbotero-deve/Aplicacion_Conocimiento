const express = require("express");
const cors = require("cors");
require("dotenv").config();

const usuarios = require("./controllers/usuarios");
const ganado = require("./controllers/ganado");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de usuarios
app.post("/register", usuarios.registro);
app.post("/login", usuarios.login);

// Rutas de ganado
app.post("/ganado", ganado.ingreso);
app.put("/ganado/bloquear/:id", ganado.bloquear);
app.get("/ganado/chapeta/:chapeta", ganado.buscarPorChapeta);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
