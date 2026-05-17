const db = require("../models/db");

exports.ingreso = async (req,res) => {
  const {chapeta,raza,edad,peso,fecha_ingreso,estadoICA} = req.body;
  await db.query("INSERT INTO ganado(chapeta,raza,edad,peso,fecha_ingreso,estadoICA) VALUES($1,$2,$3,$4,$5,$6)",
    [chapeta,raza,edad,peso,fecha_ingreso,estadoICA]);
  res.json({message:"Ganado ingresado"});
};

exports.bloquear = async (req,res) => {
  const {id} = req.params;
  await db.query("UPDATE ganado SET bloqueado=1 WHERE id=$1",[id]);
  res.json({message:"Registro bloqueado"});
};

exports.buscarPorChapeta = async (req,res) => {
  const {chapeta} = req.params;
  const result = await db.query("SELECT * FROM ganado WHERE chapeta=$1",[chapeta]);
  if(result.rows.length===0) return res.status(404).json({message:"Chapeta no encontrada"});
  res.json(result.rows[0]);
};
