const express = require("express");
const router = express.Router();

// Importamos las funciones desestructuradas directamente desde el controlador
const {
  ingreso,
  bloquear,
  buscarPorChapeta,
} = require("../controllers/ganado");

// 📌 Endpoints del Inventario Bovino
router.post("/ingreso", ingreso);
router.put("/bloquear/:id", bloquear);
router.get("/buscar/:chapeta", buscarPorChapeta);

// 🚨 REGLA DE ORO: Exportar el enrutador para que Express lo pueda leer
module.exports = router;
