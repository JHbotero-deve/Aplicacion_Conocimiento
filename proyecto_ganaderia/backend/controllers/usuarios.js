const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registro(req, res) {
  try {
    const { nombre_usuario, contraseña } = req.body;
    const hash = await bcrypt.hash(contraseña, 10);

    await db.query(
      "INSERT INTO usuarios (nombre_usuario, contraseña_hash, rol_usuario) VALUES ($1, $2, $3)",
      [nombre_usuario, hash, "operador"]
    );

    res.status(201).send("Usuario registrado");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el registro");
  }
}

async function login(req, res) {
  try {
    const { nombre_usuario, contraseña } = req.body;
    const result = await db.query(
      "SELECT * FROM usuarios WHERE nombre_usuario = $1",
      [nombre_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).send("Usuario no encontrado");
    }

    const usuario = result.rows[0];
    const valido = await bcrypt.compare(contraseña, usuario.contraseña_hash);

    if (!valido) {
      return res.status(401).send("Contraseña incorrecta");
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el login");
  }
}

module.exports = { registro, login };
