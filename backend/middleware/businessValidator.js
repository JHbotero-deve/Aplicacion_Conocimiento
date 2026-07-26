const pool = require("../models/db");
const emailService = require("../services/emailService");

/**
 * Motor de Inteligencia de Datos - Ganadería Pro
 * Detecta anomalías y desvía datos sospechosos a Cuarentena.
 */
module.exports = async (req, res, next) => {
    // Solo validamos peticiones de ingreso de datos operativos
    if (req.method !== 'POST') return next();

    const { path } = req;
    const body = req.body;
    let motivo = null;

    // 1. Regla de Oro: Registro Inicial de Ganado (NUEVA COBERTURA)
    if (path === '/ganado') {
        const peso = parseFloat(body.peso);
        const edad = parseInt(body.edad);

        if (peso > 1500) motivo = `Incoherencia biológica: Peso inicial de ${peso}kg excede el máximo bovino (1500kg).`;
        if (edad > 300) motivo = `Incoherencia biológica: Edad de ${edad} meses excede el límite productivo (25 años).`;
        if (!body.chapeta || body.chapeta.length < 2) motivo = `Identificación inválida: Chapeta muy corta o vacía.`;
    }

    // 2. Regla de Oro: Producción de Leche
    if (path === '/operaciones/produccion' && body.tipo === 'Leche') {
        const litros = parseFloat(body.cantidad);
        if (litros > 45) { // Una vaca promedia 15-30L, 45L es sospechoso/élite
            motivo = `Anomalía de Producción: ${litros}L reportados. Excede el límite de seguridad biológica (45L).`;
        }
    }

    // 2. Regla de Oro: Pesaje (Carne)
    if (path === '/operaciones/produccion' && body.tipo === 'Carne') {
        const peso = parseFloat(body.cantidad);
        if (peso > 1500 || peso < 10) { // Bovinos adultos max 1200kg aprox
            motivo = `Anomalía de Pesaje: ${peso}kg reportados. Valor fuera de rango zootécnico.`;
        }
    }

    // 3. Regla de Oro: Novedades e Inventario (Control de Fraude)
    if (path === '/operaciones/novedad' && body.tipo_novedad === 'Venta') {
        try {
            // Verificamos cuántas vacas hay realmente en la finca antes de permitir la venta
            const countRes = await pool.query(
                "SELECT COUNT(*) FROM ganado WHERE finca_id = $1 AND bloqueado = 0",
                [body.finca_id]
            );
            const totalActual = parseInt(countRes.rows[0].count);

            // Si se intenta vender un porcentaje absurdo o más de lo que hay
            if (totalActual > 0 && totalActual < 5) { // Para fincas pequeñas, control estricto
                 motivo = `Alerta de Liquidación: Intento de venta en finca con inventario crítico (${totalActual} animales).`;
            }

            if (body.descripcion && (body.descripcion.includes("todo") || body.descripcion.includes("remate"))) {
                motivo = `Venta Masiva Detectada: El usuario intenta liquidar el hato. Se requiere autorización del Admin.`;
            }

        } catch (e) { console.error("Error en validación de inventario:", e); }
    }

    // Si hay un motivo de sospecha, desviamos a Cuarentena
    if (motivo) {
        try {
            await pool.query(
                "INSERT INTO cuarentena (usuario_id, finca_id, tipo_accion, datos_json, motivo_bloqueo) VALUES ($1, $2, $3, $4, $5)",
                [req.user.id, body.finca_id || null, `POST ${path}`, JSON.stringify(body), motivo]
            );

            // Alerta inmediata al administrador
            await emailService.enviarAlertaSeguridad({
                evento: "DATO SOSPECHOSO EN CUARENTENA",
                descripcion: `El usuario ${req.user.id} intentó registrar datos anómalos. Motivo: ${motivo}`
            });

            return res.status(422).json({
                error: "REGISTRO EN REVISIÓN",
                message: "Los datos ingresados presentan inconsistencias y han sido enviados a revisión por seguridad del administrador."
            });

        } catch (error) {
            console.error("Error al procesar cuarentena:", error);
            return res.status(500).json({ error: "Error en el motor de validación de seguridad." });
        }
    }

    // Si los datos son coherentes, permitimos el paso al controlador
    next();
};
