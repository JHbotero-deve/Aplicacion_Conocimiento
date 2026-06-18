const pool = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registro = async (req, res) => {
  try {
    const { nombre_usuario, contrasena, rol_usuario } = req.body;
    const hash = await bcrypt.hash(contrasena, 10);

    await pool.query(
      "INSERT INTO usuarios (nombre_usuario, contrasena_hash, rol_usuario, fecha_creacion) VALUES ($1,$2,$3,NOW())",
      [nombre_usuario, hash, rol_usuario]
    );

    res.json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en registro" });
  }
};

const login = async (req, res) => {
  try {
    const { nombre_usuario, contrasena } = req.body;
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE nombre_usuario=$1",
      [nombre_usuario]
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
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ mensaje: "Login exitoso", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en login" });
  }
};

module.exports = { registro, login };
