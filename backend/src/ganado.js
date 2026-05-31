const db = require("../models/db");

function toBoolean(value) {
  if (typeof value === "boolean") return value;
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "si" || normalized === "sí";
}

async function ingreso(req, res) {
  try {
    const {
      chapeta,
      raza,
      edad,
      peso,
      fecha_ingreso,
      estadoica,
      estadoICA,
      certificado_ica,
      bloqueado,
    } = req.body || {};

    const chapetaValue = String(chapeta || "").trim();
    const razaValue = String(raza || "").trim();
    const estadoIcaValue = String(estadoica || estadoICA || "").trim() || "pendiente";
    const edadValue = Number(edad);
    const pesoValue = Number(peso);
    const fechaIngresoValue = fecha_ingreso ? new Date(fecha_ingreso) : new Date();

    if (!chapetaValue || !razaValue || !Number.isFinite(edadValue) || !Number.isFinite(pesoValue)) {
      return res.status(400).json({
        error: "chapeta, raza, edad y peso son obligatorios y deben ser válidos",
      });
    }

    if (Number.isNaN(fechaIngresoValue.getTime())) {
      return res.status(400).json({ error: "fecha_ingreso no es válida" });
    }

    const result = await db.query(
      `INSERT INTO ganado
        (chapeta, raza, edad, peso, fecha_ingreso, estadoica, certificado_ica, bloqueado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        chapetaValue,
        razaValue,
        edadValue,
        pesoValue,
        fechaIngresoValue,
        estadoIcaValue,
        toBoolean(certificado_ica),
        toBoolean(bloqueado),
      ],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "No se pudo guardar ganado", detalle: error.message });
  }
}

async function listar(req, res) {
  try {
    const result = await db.query("SELECT * FROM ganado ORDER BY id DESC");
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: "Error al consultar ganado", detalle: error.message });
  }
}

async function bloquear(req, res) {
  try {
    const id = Number(req.params?.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: "id inválido" });
    }

    const result = await db.query(
      "UPDATE ganado SET bloqueado=true WHERE id=$1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Registro de ganado no encontrado" });
    }

    return res.json({ message: "Registro bloqueado", ganado: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Error al bloquear registro", detalle: error.message });
  }
}

async function buscarPorChapeta(req, res) {
  try {
    const chapeta = String(req.params?.chapeta || "").trim();
    if (!chapeta) {
      return res.status(400).json({ error: "chapeta inválida" });
    }
    const result = await db.query(
      "SELECT * FROM ganado WHERE chapeta=$1 LIMIT 1",
      [chapeta],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Chapeta no encontrada" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "Error al buscar chapeta", detalle: error.message });
  }
}

module.exports = { ingreso, listar, bloquear, buscarPorChapeta };
