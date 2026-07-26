const db = require("../models/db");

exports.ingreso = async (req, res) => {
  const {
    chapeta, especie, sexo, raza, categoria_etaria,
    edad, peso, fecha_ingreso, estadoica, ruv_numero,
    hierro_descripcion, finca_id
  } = req.body;

  try {
    await db.query(
      `INSERT INTO ganado (
        chapeta, especie, sexo, raza, categoria_etaria,
        edad, peso, fecha_ingreso, estadoica, ruv_numero,
        hierro_descripcion, finca_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        chapeta, especie || 'Bovino', sexo, raza, categoria_etaria,
        edad, peso, fecha_ingreso, estadoica, ruv_numero,
        hierro_descripcion, finca_id || null
      ]
    );
    res.json({ message: "Registro pecuario exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar en base de datos. Verifique si la chapeta ya existe." });
  }
};

exports.bloquear = async (req, res) => {
  const { id } = req.params;
  await db.query("UPDATE ganado SET bloqueado=1 WHERE id=$1", [id]);
  res.json({ message: "Registro bloqueado" });
};

exports.buscarPorChapeta = async (req, res) => {
  const { chapeta } = req.params;
  const result = await db.query("SELECT * FROM ganado WHERE chapeta=$1", [chapeta]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Chapeta no encontrada" });
  }
  res.json(result.rows[0]);
};

exports.obtenerEstadisticas = async (req, res) => {
  try {
    const totalCabezas = await db.query("SELECT COUNT(*) FROM ganado");
    const pesoTotal = await db.query("SELECT SUM(peso) FROM ganado");
    const pesoPromedio = await db.query("SELECT AVG(peso) FROM ganado");
    const bloqueados = await db.query("SELECT COUNT(*) FROM ganado WHERE bloqueado = 1");

    res.json({
      totalCabezas: totalCabezas.rows[0].count,
      pesoTotal: pesoTotal.rows[0].sum || 0,
      pesoPromedio: parseFloat(pesoPromedio.rows[0].avg || 0).toFixed(2),
      bloqueados: bloqueados.rows[0].count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};
