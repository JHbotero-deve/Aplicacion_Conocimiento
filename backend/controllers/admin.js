const pool = require("../models/db");
const bcrypt = require("bcrypt");

// Listar todos los usuarios
exports.listarUsuarios = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, nombre_usuario, rol_usuario, fecha_creacion, intentos_fallidos, bloqueado_hasta FROM usuarios ORDER BY id ASC"
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al listar usuarios" });
    }
};

// Cambiar contraseña de cualquier usuario
exports.cambiarPassword = async (req, res) => {
    try {
        const { id, nuevaContrasena } = req.body;
        const hash = await bcrypt.hash(nuevaContrasena, 10);
        await pool.query("UPDATE usuarios SET contrasena_hash = $1, intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = $2", [hash, id]);
        res.json({ mensaje: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al cambiar contraseña" });
    }
};

// CRUD Fincas
exports.listarFincas = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM fincas ORDER BY id ASC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al listar fincas" });
    }
};

exports.crearFinca = async (req, res) => {
    try {
        const { nombre, matricula, extension, vereda, municipio } = req.body;
        await pool.query(
            "INSERT INTO fincas (nombre, matricula_inmobiliaria, extension, vereda, municipio) VALUES ($1, $2, $3, $4, $5)",
            [nombre, matricula, extension, vereda, municipio]
        );
        res.json({ mensaje: "Finca registrada exitosamente ante el ICA" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar la finca" });
    }
};

// Auditoría
exports.obtenerAuditoria = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.*, u.nombre_usuario, f.nombre as nombre_finca
            FROM auditoria a
            LEFT JOIN usuarios u ON a.usuario_id = u.id
            LEFT JOIN fincas f ON a.finca_id = f.id
            ORDER BY a.fecha DESC LIMIT 100
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener auditoría" });
    }
};

// Gestión de Cuarentena (Anti-Fraude)
exports.listarCuarentena = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, u.nombre_usuario, f.nombre as nombre_finca
            FROM cuarentena c
            LEFT JOIN usuarios u ON c.usuario_id = u.id
            LEFT JOIN fincas f ON c.finca_id = f.id
            WHERE c.estado = 'Pendiente'
            ORDER BY c.fecha DESC
        `);
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: "Error al listar cuarentena" }); }
};

exports.procesarCuarentena = async (req, res) => {
    const { id, accion } = req.body; // accion: 'APROBAR' o 'DESCARTAR'
    try {
        if (accion === 'DESCARTAR') {
            await pool.query("UPDATE cuarentena SET estado = 'Descartado' WHERE id = $1", [id]);
            return res.json({ message: "Registro descartado por seguridad." });
        }

        // Si se aprueba, el Admin debe ingresar el dato manualmente por ahora (o implementar re-inyección lógica)
        await pool.query("UPDATE cuarentena SET estado = 'Aprobado' WHERE id = $1", [id]);
        res.json({ message: "Dato marcado como aprobado para ingreso manual." });

    } catch (e) { res.status(500).json({ error: "Error al procesar" }); }
};
