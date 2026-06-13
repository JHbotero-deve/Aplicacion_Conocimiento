const express = require("express");
const { resetPassword } = require("../auth/resetPassword");
const { forgotPassword } = require("../auth/forgotPassword");
const router = express.Router();

router.post("/reset-password", async (req, res) => {
  const { nombre_usuario, nueva_contrasena } = req.body;
  try {
    const ok = await resetPassword(nombre_usuario, nueva_contrasena);
    if (ok) {
      res.json({ status: "✅ Contraseña actualizada" });
    } else {
      res.status(404).json({ status: "❌ Usuario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ status: "❌ Error", error: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { nombre_usuario } = req.body;
  try {
    const token = await forgotPassword(nombre_usuario);
    res.json({ status: "✅ Token generado", token });
  } catch (err) {
    res.status(500).json({ status: "❌ Error", error: err.message });
  }
});

module.exports = router;
