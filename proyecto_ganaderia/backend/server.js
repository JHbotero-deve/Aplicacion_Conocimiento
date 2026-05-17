const express = require("express");
const cors = require("cors");
const usuarios = require("./controllers/usuarios");
const ganado = require("./controllers/ganado");
const auth = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5500",
  methods: ["GET","POST","PUT"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.post("/register", usuarios.registro);
app.post("/login", usuarios.login);
app.post("/ganado", auth, ganado.ingreso);
app.put("/ganado/bloquear/:id", auth, ganado.bloquear);
app.get("/ganado/chapeta/:chapeta", auth, ganado.buscarPorChapeta);

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
