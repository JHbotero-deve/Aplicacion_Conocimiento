const db = require("../models/db");

// 1. Programar Cita
exports.programarCita = async (req, res) => {
    const { finca_id, animal_id, fecha_programada, motivo, observaciones } = req.body;
    try {
        await db.query(
            "INSERT INTO citas_veterinarias (finca_id, veterinario_id, animal_id, fecha_programada, motivo, observaciones) VALUES ($1, $2, $3, $4, $5, $6)",
            [finca_id, req.user.id, animal_id || null, fecha_programada, motivo, observaciones]
        );
        res.json({ message: "Cita programada con éxito ✅" });
    } catch (e) { res.status(500).json({ error: "Error al programar cita" }); }
};

// 2. Ver Citas (Para Veterinario o Mayordomo)
exports.listarCitas = async (req, res) => {
    try {
        let query = `
            SELECT c.*, f.nombre as nombre_finca, g.chapeta
            FROM citas_veterinarias c
            JOIN fincas f ON c.finca_id = f.id
            LEFT JOIN ganado g ON c.animal_id = g.id
        `;
        let params = [];

        if (req.user.rol === 'veterinario') {
            query += " WHERE c.veterinario_id = $1";
            params.push(req.user.id);
        } else if (req.user.rol === 'mayordomo') {
            // El mayordomo solo ve citas de su finca asignada
            query += " JOIN usuario_finca uf ON f.id = uf.finca_id WHERE uf.usuario_id = $1";
            params.push(req.user.id);
        }

        query += " ORDER BY c.fecha_programada ASC";
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: "Error al obtener citas" }); }
};

// 3. Crear Campaña Vacunación
exports.crearCampana = async (req, res) => {
    const { nombre, fecha_inicio, fecha_fin, especie_objetivo, insumo_id } = req.body;
    try {
        await db.query(
            "INSERT INTO campanas_vacunacion (nombre, fecha_inicio, fecha_fin, especie_objetivo, insumo_id) VALUES ($1, $2, $3, $4, $5)",
            [nombre, fecha_inicio, fecha_fin, especie_objetivo, insumo_id]
        );
        res.json({ message: "Campaña de vacunación creada ✅" });
    } catch (e) { res.status(500).json({ error: "Error al crear campaña" }); }
};

// 4. Ver Historial Clínico de un Animal
exports.historialClinico = async (req, res) => {
    const { chapeta } = req.params;
    try {
        const result = await db.query(`
            SELECT t.*, u.nombre_usuario as veterinario, r.instrucciones_detalladas
            FROM ganado g
            JOIN tratamientos t ON g.id = t.ganado_id
            LEFT JOIN usuarios u ON t.responsable_id = u.id
            LEFT JOIN recetas_medicas r ON t.id = r.tratamiento_id
            WHERE g.chapeta = $1
            ORDER BY t.fecha DESC
        `, [chapeta]);
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: "Error al obtener historial" }); }
};
