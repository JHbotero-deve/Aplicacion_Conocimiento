const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = header.split(" ")[1];
  try {
    const secret = String(process.env.JWT_SECRET || "").trim();
    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET no configurado en el servidor" });
    }
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // guardar datos del usuario en la request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
