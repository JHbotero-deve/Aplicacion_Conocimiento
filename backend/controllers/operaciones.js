const db = require("../models/db");

// 1. Tratamientos Médicos
exports.registrarTratamiento = async (req, res) => {
    const { ganado_id, diagnostico, producto, lote, dosis, via, tiempo_retiro } = req.body;
    try {
        // Buscamos el ID real por la chapeta
        const animal = await db.query("SELECT id FROM ganado WHERE chapeta = $1", [ganado_id]);
        if (animal.rows.length === 0) return res.status(404).json({ error: "Animal no encontrado" });

        await db.query(
            "INSERT INTO tratamientos (ganado_id, diagnostico, producto, lote, dosis, via_administracion, tiempo_retiro_dias, responsable_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [animal.rows[0].id, diagnostico, producto, lote, dosis, via, tiempo_retiro, req.user.id]
        );
        res.json({ message: "Tratamiento guardado ✅" });
    } catch (e) { res.status(500).json({ error: "Error al guardar" }); }
};

// 2. Producción
exports.registrarProduccion = async (req, res) => {
    const { ganado_id, tipo, cantidad, unidad, observaciones } = req.body;
    try {
        const animal = await db.query("SELECT id FROM ganado WHERE chapeta = $1", [ganado_id]);
        if (animal.rows.length === 0) return res.status(404).json({ error: "Animal no encontrado" });

        await db.query(
            "INSERT INTO produccion (ganado_id, tipo, cantidad, unidad, observaciones) VALUES ($1, $2, $3, $4, $5)",
            [animal.rows[0].id, tipo, cantidad, unidad, observaciones]
        );
        res.json({ message: "Producción registrada ✅" });
    } catch (e) { res.status(500).json({ error: "Error al guardar" }); }
};

// 3. Novedades
exports.registrarNovedad = async (req, res) => {
    const { ganado_id, tipo_novedad, descripcion, finca_id } = req.body;
    try {
        const animal = await db.query("SELECT id FROM ganado WHERE chapeta = $1", [ganado_id]);
        if (animal.rows.length === 0) return res.status(404).json({ error: "Animal no encontrado" });

        await db.query(
            "INSERT INTO novedades (ganado_id, tipo_novedad, descripcion, finca_id) VALUES ($1, $2, $3, $4)",
            [animal.rows[0].id, tipo_novedad, descripcion, finca_id || null]
        );
        res.json({ message: "Novedad registrada ✅" });
    } catch (e) { res.status(500).json({ error: "Error al guardar" }); }
};

// 4. Insumos
exports.registrarInsumo = async (req, res) => {
    const { nombre, tipo, registro_ica, cantidad, unidad, fecha_vencimiento, finca_id } = req.body;
    try {
        await db.query(
            "INSERT INTO insumos (nombre, tipo, registro_ica, cantidad_actual, unidad_medida, fecha_vencimiento, finca_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [nombre, tipo, registro_ica, cantidad, unidad, fecha_vencimiento, finca_id || null]
        );
        res.json({ message: "Insumo guardado ✅" });
    } catch (e) { res.status(500).json({ error: "Error al guardar" }); }
};
