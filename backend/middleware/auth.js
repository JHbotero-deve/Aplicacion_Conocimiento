const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ message: "Token requerido" }); }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificación de Huella Digital (Seguridad Edge)
    // Evita que un token robado sea usado en un dispositivo o navegador diferente
    const clientFingerprint = req.headers['user-agent'];
    if (decoded.fingerprint && decoded.fingerprint !== clientFingerprint) {
        return res.status(403).json({
            error: "BRECHA DE SEGURIDAD DETECTADA",
            message: "La sesión no coincide con el dispositivo original. Acceso bloqueado."
        });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
