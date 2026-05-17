const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

exports.registro = async (req,res) => {
  const {usuario, contraseña, rol} = req.body;
  const hash = await bcrypt.hash(contraseña,10);
  await db.query("INSERT INTO usuarios(usuario,contraseña,rol) VALUES($1,$2,$3)",[usuario,hash,rol]);
  res.json({message:"Usuario registrado"});
};

exports.login = async (req,res) => {
  const {usuario, contraseña} = req.body;
  const result = await db.query("SELECT * FROM usuarios WHERE usuario=$1",[usuario]);
  if(result.rows.length===0) return res.status(401).json({message:"Usuario no encontrado"});
  const valido = await bcrypt.compare(contraseña,result.rows[0].contraseña);
  if(!valido) return res.status(401).json({message:"Contraseña incorrecta"});
  const token = jwt.sign({id:result.rows[0].id,rol:result.rows[0].rol},"secreto",{expiresIn:"1h"});
  res.json({token});
};
