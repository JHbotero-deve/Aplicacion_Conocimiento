const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const usuarios = require("./controllers/usuarios" );
const ganado = require("./controllers/ganado");
const admin = require("./controllers/admin");
const auth = require("./middleware/auth");
const checkRole = require("./middleware/roleAuth");
const auditor = require("./middleware/logger");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Rutas públicas
app.post("/register", usuarios.registro);
app.post("/login", usuarios.login);        

// Middleware de auditoría para todas las rutas protegidas que cambian datos
app.use(auth, auditor);

// Rutas protegidas (Usuario, Veterinario, Admin)
app.post("/ganado", ganado.ingreso);
app.put("/ganado/bloquear/:id", ganado.bloquear);
app.get("/ganado/chapeta/:chapeta", ganado.buscarPorChapeta);

// Rutas Administrativas (Solo Admin)
app.get("/admin/stats", checkRole(['admin']), ganado.obtenerEstadisticas);
app.get("/admin/usuarios", checkRole(['admin']), admin.listarUsuarios);
app.post("/admin/usuarios/password", checkRole(['admin']), admin.cambiarPassword);
app.get("/admin/fincas", checkRole(['admin']), admin.listarFincas);
app.post("/admin/fincas", checkRole(['admin']), admin.crearFinca);
app.get("/admin/auditoria", checkRole(['admin']), admin.obtenerAuditoria);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
