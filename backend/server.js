const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const QRCode = require("qrcode");
const os = require("os");
require("dotenv").config();
const pool = require("./models/db");

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

app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Evita que un fallo de conexión inactiva de PostgreSQL finalice el proceso de Node.
pool.on("error", (error) => {
    console.error("Conexión de base de datos perdida:", error.message);
});

// --- CAPA DE SEGURIDAD (SECURITY EDGE) ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "data:"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'"]
        }
    }
}));
app.disable('x-powered-by');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "DEMASIADAS PETICIONES", message: "Su acceso ha sido limitado temporalmente por seguridad." }
});
app.use("/login", limiter);
app.use("/register", limiter);

// Permite comprobar que los servicios necesarios están disponibles antes de usar la aplicación.
app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).json({ status: "ok", database: "available" });
    } catch (error) {
        console.error("Health check fallido:", error.message);
        res.status(503).json({ status: "unavailable", database: "unavailable" });
    }
});

app.use(express.static(path.join(__dirname, "..", "frontend")));

// Endpoint para generar el LINK y QR de acceso para el Ganadero
app.get("/admin/acceso-qr", async (req, res) => {
    try {
        const interfaces = os.networkInterfaces();
        let ipLocal = 'localhost';
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    ipLocal = iface.address;
                }
            }
        }

        const urlAcceso = `http://${ipLocal}:8000`;
        const qrDataUrl = await QRCode.toDataURL(urlAcceso);

        res.send(`
            <body style="background: #020617; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
                <div style="background: white; padding: 20px; border-radius: 20px; margin-bottom: 20px;">
                    <img src="${qrDataUrl}" style="width: 250px; height: 250px;" />
                </div>
                <h1 style="margin: 0;">Link de Acceso Ganadero</h1>
                <a href="${urlAcceso}" style="color: #10b981; font-size: 24px; font-weight: bold; margin-top: 10px;">${urlAcceso}</a>
                <p style="color: #64748b; margin-top: 20px;">Escanea el código con tu celular o entra al link</p>
                <button onclick="window.location.href='/'" style="margin-top: 30px; background: #1e293b; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer;">Volver al Inicio</button>
            </body>
        `);
    } catch (err) {
        res.status(500).send("Error generando acceso.");
    }
});

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
    if (res.headersSent) return next(err);
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
