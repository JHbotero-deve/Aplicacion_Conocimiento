const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const usuarios = require("./controllers/usuarios");
const ganado = require("./controllers/ganado");

const app = express();
app.use(cors());
app.use(express.json());

// Servir frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "frontend")));

// Rutas de usuarios
app.post("/register", usuarios.registro);   // Registro de usuario
app.post("/login", usuarios.login);         // Login de usuario

// Rutas de ganado
app.post("/ganado", ganado.ingreso);        // Ingreso de ganado
app.put("/ganado/bloquear/:id", ganado.bloquear);   // Bloquear registro por ID
app.get("/ganado/chapeta/:chapeta", ganado.buscarPorChapeta); // Buscar ganado por chapeta

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
