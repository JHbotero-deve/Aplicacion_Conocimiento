/**
 * Script de Auditoría Inteligente - Ganadería Pro
 * Ejecuta revisiones automáticas sobre la base de datos para detectar ataques.
 */

const pool = require("../backend/models/db");
const emailService = require("../backend/services/emailService");

async function revisarAuditoria() {
    try {
        console.log("🔍 Iniciando revisión de auditoría...");

        // 1. Buscar intentos de fuerza bruta en la tabla de usuarios
        const bloqueoRes = await pool.query(
            "SELECT nombre_usuario, intentos_fallidos FROM usuarios WHERE intentos_fallidos >= 5 AND bloqueado_hasta > NOW()"
        );

        if (bloqueoRes.rows.length > 0) {
            for (const usuario of bloqueoRes.rows) {
                await emailService.enviarAlertaSeguridad({
                    evento: "Bloqueo de Cuenta",
                    descripcion: `El usuario '${usuario.nombre_usuario}' ha sido bloqueado tras 5 intentos fallidos.`
                });
            }
        }

        // 2. Buscar patrones de acceso no autorizado en logs de auditoría (últimas 2 horas)
        const auditoriaRes = await pool.query(`
            SELECT a.*, u.nombre_usuario
            FROM auditoria a
            LEFT JOIN usuarios u ON a.usuario_id = u.id
            WHERE a.fecha > NOW() - INTERVAL '2 hours'
            AND a.accion LIKE '%403%' OR a.accion LIKE '%401%'
        `);

        if (auditoriaRes.rows.length >= 10) {
            await emailService.enviarAlertaSeguridad({
                evento: "Múltiples Accesos Denegados",
                descripcion: `Se han detectado ${auditoriaRes.rows.length} intentos de acceso denegado en las últimas 2 horas. Posible escaneo de vulnerabilidades.`
            });
        }

        console.log("✅ Revisión completada.");
    } catch (error) {
        console.error("❌ Error en el script de revisión:", error);
    }
}

// Ejecutar cada 15 minutos
setInterval(revisarAuditoria, 15 * 60 * 1000);

// Ejecución inmediata al iniciar
revisarAuditoria();
