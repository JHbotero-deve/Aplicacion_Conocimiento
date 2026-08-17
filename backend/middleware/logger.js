const pool = require("../models/db");

/**
 * Middleware para auditoría automática de acciones
 */
module.exports = async (req, res, next) => {
    // Solo auditamos métodos que cambian datos
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
        // Capturamos el final de la respuesta para saber si fue exitosa
        const oldJson = res.json;
        res.json = function(data) {
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                const accion = `${req.method} ${req.path}`;

                // Redactar datos sensibles (Steel Edge Privacy)
                const redactedBody = { ...req.body };
                const sensitiveKeys = ['contrasena', 'contrasena_hash', 'respuesta', 'respuesta_hash', 'nuevaContrasena', 'password'];
                sensitiveKeys.forEach(key => { if (redactedBody[key]) redactedBody[key] = '[REDACTADO]'; });

                const descripcion = `Usuario ${req.user.id} realizó ${req.method} en ${req.path}. Body: ${JSON.stringify(redactedBody)}`;

                // Intentamos extraer finca_id del body si existe
                const finca_id = req.body.finca_id || null;

                pool.query(
                    "INSERT INTO auditoria (usuario_id, accion, descripcion, finca_id) VALUES ($1, $2, $3, $4)",
                    [req.user.id, accion, descripcion, finca_id]
                ).catch(err => console.error("Error en auditoría:", err));
            }
            return oldJson.apply(res, arguments);
        };
    }
    next();
};
