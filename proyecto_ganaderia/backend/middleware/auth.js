const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
  const header = req.headers["authorization"];
  if(!header) return res.status(401).json({message:"Token requerido"});
  const token = header.split(" ")[1];
  try {
    jwt.verify(token,"secreto");
    next();
  } catch(err) {
    res.status(401).json({message:"Token inválido"});
  }
};
