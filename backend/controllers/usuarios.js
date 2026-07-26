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

    // Verificar si la cuenta está bloqueada
    if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > new Date()) {
      const tiempoRestante = Math.ceil((new Date(usuario.bloqueado_hasta) - new Date()) / 60000);
      return res.status(403).json({
        error: `Cuenta bloqueada temporalmente. Intente de nuevo en ${tiempoRestante} minutos.`
      });
    }

    const valido = await bcrypt.compare(contrasena, usuario.contrasena_hash);

    if (!valido) {
      // Incrementar intentos fallidos
      const nuevosIntentos = usuario.intentos_fallidos + 1;
      let bloqueadoHasta = null;

      if (nuevosIntentos >= 5) {
        bloqueadoHasta = new Date(Date.now() + 60 * 60 * 1000); // 1 hora desde ahora
      }

      await pool.query(
        "UPDATE usuarios SET intentos_fallidos = $1, bloqueado_hasta = $2 WHERE id = $3",
        [nuevosIntentos, bloqueadoHasta, usuario.id]
      );

      const mensaje = nuevosIntentos >= 5
        ? "Demasiados intentos fallidos. Cuenta bloqueada por 1 hora."
        : "Contraseña incorrecta.";

      return res.status(401).json({ error: mensaje });
    }

    // Login exitoso: Resetear contadores
    await pool.query(
      "UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = $1",
      [usuario.id]
    );

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      rol_usuario: usuario.rol_usuario
    });
  } catch (error) {
    console.error("Error durante el proceso de login:", error);
    res.status(500).json({ error: "Error interno del servidor durante el login." });
  }
};

module.exports = { registro, login };
