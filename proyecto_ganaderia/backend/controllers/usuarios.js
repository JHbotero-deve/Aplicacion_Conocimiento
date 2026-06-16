const pool = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔑 1. Registro de nuevos usuarios
const registro = async (req, res) => {
  try {
    const { nombre_usuario, contrasena, rol_usuario } = req.body;
    const hash = await bcrypt.hash(contrasena, 10);

    await pool.query(
      "INSERT INTO usuarios (nombre_usuario, contrasena_hash, rol_usuario, fecha_creacion) VALUES ($1,$2,$3,NOW())",
      [nombre_usuario, hash, rol_usuario],
    );

    res.json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("❌ Error en registro:", error.message);
    res.status(500).json({ error: "Error en registro" });
  }
};

// 🚪 2. Inicio de sesión (Autenticación)
const login = async (req, res) => {
  try {
    const { nombre_usuario, contrasena } = req.body;
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE nombre_usuario=$1",
      [nombre_usuario],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];
    const valido = await bcrypt.compare(contrasena, usuario.contrasena_hash);

    if (!valido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol_usuario },
      process.env.JWT_SECRET || "FirmaSecretaSuperSeguraFincaGanadera", // Fallback seguro
      { expiresIn: "1h" },
    );

    res.json({ mensaje: "Login exitoso", token });
  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.status(500).json({ error: "Error en login" });
  }
};

// 📡 3. Solicitud de recuperación (Generar token temporal)
const forgotPassword = async (nombre_usuario) => {
  // Primero validamos si el usuario existe en Postgres
  const result = await pool.query(
    "SELECT id, rol_usuario FROM usuarios WHERE nombre_usuario = $1",
    [nombre_usuario],
  );

  if (result.rows.length === 0) {
    throw new Error("El usuario no existe");
  }

  const usuario = result.rows[0];

  // Generamos un token temporal express de 15 minutos para recuperar la clave
  const tempToken = jwt.sign(
    { id: usuario.id, tipo: "recuperacion" },
    process.env.JWT_SECRET || "FirmaSecretaSuperSeguraFincaGanadera",
    { expiresIn: "15m" },
  );

  return tempToken;
};

// 🔄 4. Reestablecer contraseña (Actualización en la BD)
const resetPassword = async (nombre_usuario, nueva_contrasena) => {
  const hash = await bcrypt.hash(nueva_contrasena, 10);

  const result = await pool.query(
    "UPDATE usuarios SET contrasena_hash = $1 WHERE nombre_usuario = $2",
    [hash, nombre_usuario],
  );

  // result.rowCount nos dice cuántas filas se vieron afectadas en el UPDATE
  return result.rowCount > 0;
};

// Exportamos todas las funciones dentro del mismo objeto estructurado
module.exports = {
  registro,
  login,
  forgotPassword,
  resetPassword,
};
