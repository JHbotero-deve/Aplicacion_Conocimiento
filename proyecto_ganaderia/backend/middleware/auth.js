const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ message: "❌ Token requerido" });
  }

  const token = header.split(" ")[1]; // formato: Bearer TOKEN
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // usa variable de entorno
    req.user = decoded; // guardar datos del usuario en la request
    next(); // continuar con la ruta protegida
  } catch (err) {
    return res.status(403).json({ message: "❌ Token inválido o expirado" });
  }
};
