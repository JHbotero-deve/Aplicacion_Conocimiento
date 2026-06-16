const pool = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function normalizePassword(body) {
  return String(
    body?.contrasena
    || body?.contrasena_hash
    || body?.["contraseña"]
    || "",
  ).trim();
}

function normalizeRole(body) {
  return String(body?.rol_usuario || "usuario").trim().toLowerCase();
}

async function registro(req, res) {
  try {
    const nombreUsuario = String(req.body?.nombre_usuario || "").trim();
    const contrasena = normalizePassword(req.body);
    const rolUsuario = normalizeRole(req.body);

    if (!nombreUsuario || !contrasena) {
      return res.status(400).json({ error: "nombre_usuario y contrasena son obligatorios" });
    }

    const existing = await pool.query(
      "SELECT id FROM usuarios WHERE nombre_usuario=$1 LIMIT 1",
      [nombreUsuario],
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const result = await pool.query(
      "INSERT INTO usuarios (nombre_usuario, contrasena_hash, rol_usuario, fecha_creacion) VALUES ($1,$2,$3,NOW()) RETURNING id, nombre_usuario, rol_usuario, fecha_creacion",
      [nombreUsuario, hash, rolUsuario],
    );

    return res.status(201).json({
      mensaje: "Usuario registrado con éxito",
      usuario: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Error en registro", detalle: error.message });
  }
}

async function login(req, res) {
  try {
    const nombreUsuario = String(req.body?.nombre_usuario || "").trim();
    const contrasena = normalizePassword(req.body);

    if (!nombreUsuario || !contrasena) {
      return res.status(400).json({ error: "nombre_usuario y contrasena son obligatorios" });
    }

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE nombre_usuario=$1 LIMIT 1",
      [nombreUsuario],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];
    const valido = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!valido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const secret = String(process.env.JWT_SECRET || "").trim();
    if (!secret) {
      return res.status(500).json({ error: "JWT_SECRET no configurado en .env" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol_usuario, nombre_usuario: usuario.nombre_usuario },
      secret,
      { expiresIn: "1h" },
    );

    return res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        rol_usuario: usuario.rol_usuario,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Error en login", detalle: error.message });
  }
}

async function listar(req, res) {
  try {
    const result = await pool.query("SELECT id, nombre_usuario, rol_usuario, fecha_creacion FROM usuarios ORDER BY id ASC");
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: "Error al consultar usuarios", detalle: error.message });
  }
}

module.exports = { registro, login, listar };
