const db = require("../models/db");

// 🤠 1. Ingresar Ganado con control de fallos
const ingreso = async (req, res) => {
  const { chapeta, raza, edad, peso, fecha_ingreso, estadoICA } = req.body;

  try {
    await db.query(
      "INSERT INTO ganado(chapeta, raza, edad, peso, fecha_ingreso, estadoICA) VALUES($1, $2, $3, $4, $5, $6)",
      [chapeta, raza, edad, peso, fecha_ingreso, estadoICA],
    );
    res.status(201).json({ message: "Ganado ingresado con éxito" });
  } catch (error) {
    console.error("❌ Error en ingreso de ganado:", error.message);
    res.status(500).json({ error: "Error interno al registrar el ganado" });
  }
};

// 🔒 2. Bloqueo Lógico sin falsos positivos
const bloquear = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE ganado SET bloqueado = true WHERE id = $1",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "El ID del animal no existe" });
    }

    res.json({
      message: "Registro bloqueado correctamente en la base de datos",
    });
  } catch (error) {
    console.error("❌ Error al bloquear ganado:", error.message);
    res.status(500).json({ error: "No se pudo bloquear el registro" });
  }
};

// 🔍 3. Buscar por Chapeta estable
const buscarPorChapeta = async (req, res) => {
  const { chapeta } = req.params;

  try {
    const result = await db.query("SELECT * FROM ganado WHERE chapeta = $1", [
      chapeta,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Chapeta no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al buscar por chapeta:", error.message);
    res
      .status(500)
      .json({ error: "Error en el servidor al realizar la búsqueda" });
  }
};

// 🚨 REGLA DE ORO BACKEND: Exportación en un único objeto unificado
module.exports = {
  ingreso,
  bloquear,
  buscarPorChapeta,
};
