const pool = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailService = require("../services/emailService");

const registro = async (req, res) => {
  try {
    const { nombre_usuario, contrasena, rol_usuario, pregunta_seguridad, respuesta } = req.body;
    const hash = await bcrypt.hash(contrasena, 10);
    const respuestaHash = await bcrypt.hash(respuesta.toLowerCase(), 10);

    await pool.query(
      "INSERT INTO usuarios (nombre_usuario, contrasena_hash, rol_usuario, pregunta_seguridad, respuesta_hash, fecha_creacion) VALUES ($1,$2,$3,$4,$5,NOW())",
      [nombre_usuario, hash, rol_usuario, pregunta_seguridad, respuestaHash]
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

        // ALERTAR AL ADMIN: Intento masivo fallido
        await emailService.enviarAlertaSeguridad({
            evento: "BLOQUEO POR FUERZA BRUTA",
            descripcion: `La cuenta '${nombre_usuario}' ha sido bloqueada tras 5 fallos. Posible intruso.`
        });
      }

      await pool.query(
        "UPDATE usuarios SET intentos_fallidos = $1, bloqueado_hasta = $2 WHERE id = $3",
        [nuevosIntentos, bloqueadoHasta, usuario.id]
      );

      const mensaje = nuevosIntentos >= 5
        ? "Demasiados intentos fallidos. Cuenta bloqueada por 1 hora. El administrador ha sido notificado."
        : "Contraseña incorrecta.";

      return res.status(401).json({ error: mensaje });
    }

    // Login exitoso: Resetear contadores
    await pool.query(
      "UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = $1",
      [usuario.id]
    );

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol_usuario,
        fingerprint: req.headers['user-agent'] // Guardar huella del dispositivo
      },
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

// Nueva lógica de recuperación
const obtenerPregunta = async (req, res) => {
    try {
        const { nombre_usuario } = req.params;
        const result = await pool.query("SELECT pregunta_seguridad FROM usuarios WHERE nombre_usuario = $1", [nombre_usuario]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Usuario no existe" });
        res.json({ pregunta: result.rows[0].pregunta_seguridad });
    } catch (e) { res.status(500).json({ error: "Error de servidor" }); }
};

const verificarRespuestaYResetear = async (req, res) => {
    try {
        const { nombre_usuario, respuesta, nuevaContrasena } = req.body;
        const userRes = await pool.query("SELECT * FROM usuarios WHERE nombre_usuario = $1", [nombre_usuario]);
        if (userRes.rows.length === 0) return res.status(404).json({ error: "Usuario no existe" });

        const usuario = userRes.rows[0];
        const valida = await bcrypt.compare(respuesta.toLowerCase(), usuario.respuesta_hash);

        if (!valida) {
            return res.status(401).json({ error: "Respuesta incorrecta" });
        }

        const nuevoHash = await bcrypt.hash(nuevaContrasena, 10);
        await pool.query("UPDATE usuarios SET contrasena_hash = $1, intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = $2", [nuevoHash, usuario.id]);

        // NOTIFICAR AL ADMIN: Cambio de clave por recuperación
        await emailService.enviarAlertaSeguridad({
            evento: "CAMBIO DE CLAVE (RECUPERACIÓN)",
            descripcion: `El usuario '${nombre_usuario}' restableció su contraseña usando su pregunta de seguridad.`
        });

        res.json({ mensaje: "Contraseña actualizada exitosamente" });
    } catch (e) { res.status(500).json({ error: "Error al resetear" }); }
};

module.exports = { registro, login, obtenerPregunta, verificarRespuestaYResetear };
