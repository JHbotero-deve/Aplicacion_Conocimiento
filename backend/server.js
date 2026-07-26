const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const usuarios = require("./controllers/usuarios" );
const ganado = require("./controllers/ganado");
const admin = require("./controllers/admin");
const operaciones = require("./controllers/operaciones");
const veterinario = require("./controllers/veterinario");
const auth = require("./middleware/auth");
const checkRole = require("./middleware/roleAuth");
const auditor = require("./middleware/logger");
const securityValidator = require("./middleware/businessValidator");

const app = express();

// --- CAPA DE SEGURIDAD (SECURITY EDGE) ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'", "https://cdn.tailwindcss.com"]
        }
    }
}));
app.disable('x-powered-by');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por IP
    message: { error: "DEMASIADAS PETICIONES", message: "Su acceso ha sido limitado temporalmente por seguridad." }
});
app.use("/login", limiter); // Proteger especialmente el login contra fuerza bruta
app.use("/register", limiter);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Rutas públicas
app.post("/register", usuarios.registro);
app.post("/login", usuarios.login);
app.get("/recuperar/pregunta/:nombre_usuario", usuarios.obtenerPregunta);
app.post("/recuperar/reset", usuarios.verificarRespuestaYResetear);

// Middleware de auditoría y validación de seguridad (solo para rutas protegidas)
app.use(auth, auditor, securityValidator);

// Rutas protegidas (Usuario, Veterinario, Admin)
app.post("/ganado", ganado.ingreso);
app.put("/ganado/bloquear/:id", ganado.bloquear);
app.get("/ganado/chapeta/:chapeta", ganado.buscarPorChapeta);

// Rutas de Operación Diaria
app.post("/operaciones/tratamiento", operaciones.registrarTratamiento);
app.post("/operaciones/produccion", operaciones.registrarProduccion);
app.post("/operaciones/novedad", operaciones.registrarNovedad);
app.post("/operaciones/insumo", operaciones.registrarInsumo);

// Rutas Veterinarias
app.post("/salud/cita", checkRole(['veterinario', 'admin']), veterinario.programarCita);
app.get("/salud/citas", checkRole(['veterinario', 'mayordomo', 'admin']), veterinario.listarCitas);
app.post("/salud/campana", checkRole(['veterinario', 'admin']), veterinario.crearCampana);
app.get("/salud/historial/:chapeta", checkRole(['veterinario', 'mayordomo', 'admin']), veterinario.historialClinico);

// Rutas Administrativas (Solo Admin)
app.get("/admin/stats", checkRole(['admin']), ganado.obtenerEstadisticas);
app.get("/admin/usuarios", checkRole(['admin']), admin.listarUsuarios);
app.post("/admin/usuarios/password", checkRole(['admin']), admin.cambiarPassword);
app.get("/admin/fincas", checkRole(['admin']), admin.listarFincas);
app.post("/admin/fincas", checkRole(['admin']), admin.crearFinca);
app.get("/admin/auditoria", checkRole(['admin']), admin.obtenerAuditoria);
app.get("/admin/cuarentena", checkRole(['admin']), admin.listarCuarentena);
app.post("/admin/cuarentena/procesar", checkRole(['admin']), admin.procesarCuarentena);

// --- MANEJO DE ERRORES CENTRALIZADO (STEEL EDGE) ---
app.use((err, req, res, next) => {
    console.error("INCIDENTE DE SEGURIDAD/SISTEMA:", err.stack);
    // No revelamos detalles técnicos al usuario final
    res.status(500).json({
        error: "ERROR INTERNO DEL NODO",
        message: "Se ha generado un reporte de incidencia automático. El administrador ha sido notificado.",
        incident_id: Date.now()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
