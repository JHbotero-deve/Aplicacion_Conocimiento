const express = require("express");
const { resetPassword, forgotPassword } = require("../controllers/usuarios");
const router = express.Router();

// 1. Ruta para reestablecer la contraseña actual
router.post("/reset-password", async (req, res) => {
  const { nombre_usuario, nueva_contrasena } = req.body;

  // Validación temprana (Evita procesar si faltan datos obligatorios)
  if (!nombre_usuario || !nueva_contrasena) {
    return res.status(400).json({ status: "❌ Faltan campos requeridos" });
  }

  try {
    const ok = await resetPassword(nombre_usuario, nueva_contrasena);
    if (ok) {
      return res.json({ status: "✅ Contraseña actualizada con éxito" });
    } else {
      // 400 Bad Request si el usuario no existe en la solicitud de cambio directo
      return res.status(400).json({
        status: "❌ No se pudo actualizar la contraseña. Verifique los datos.",
      });
    }
  } catch (err) {
    console.error("❌ Error en reset-password:", err.message);
    return res.status(500).json({ status: "❌ Error interno del servidor" });
  }
});

// 2. Ruta para solicitar recuperación (Generar token)
router.post("/forgot-password", async (req, res) => {
  const { nombre_usuario } = req.body;

  if (!nombre_usuario) {
    return res
      .status(400)
      .json({ status: "❌ El nombre de usuario es obligatorio" });
  }

  try {
    const token = await forgotPassword(nombre_usuario);

    // Respondemos con 201 Created ya que generamos un recurso temporal (el token)
    return res.status(201).json({
      status:
        "✅ Si el usuario existe, se ha generado el token de recuperación",
      token, // En producción, este token se enviaría por correo electrónico y no en el JSON directo
    });
  } catch (err) {
    console.error("❌ Error en forgot-password:", err.message);
    return res
      .status(500)
      .json({ status: "❌ Error interno al procesar la solicitud" });
  }
});

module.exports = router;
