# 05 — Estado Actual del Proyecto

**Última actualización:** 2026-05-31

---

## ✅ Completado y funcional

### Backend
- [x] Servidor Express operativo (puerto 3000)
- [x] Conexión PostgreSQL con pool pg
- [x] Modelo `usuarios` — registro, login, listar
- [x] Modelo `ganado` — ingreso, listar, bloquear, buscar por chapeta
- [x] Middleware JWT (`middleware/auth.js`)
- [x] Hash de contraseñas con bcrypt
- [x] Schema Prisma definido (Usuario + Ganado)
- [x] Seed con datos de prueba (admin, usuario1, 3 animales)
- [x] Dockerfile backend
- [x] Variables de entorno en `.env`
- [x] Endpoints legacy `/register` y `/login` para compatibilidad

### Frontend
- [x] `index.html` — pantalla de bienvenida
- [x] `forms/login.html` — login con JWT
- [x] `forms/registro.html` — registro de usuario
- [x] `forms/registro_ganado.html` — formulario ICA completo
- [x] Tailwind via CDN

---

## 🔴 Bugs conocidos (pendientes de corregir)

- [ ] `login.html`: input `name="contrasena_hash"` debe ser `name="contrasena"`
- [ ] `registro.html`: mismo bug — input `name="contrasena_hash"` debe ser `name="contrasena"`
- [ ] `registro_ganado.html`: `edad` y `peso` se envían como string — deben ser `Number()`
- [ ] `services/api.js`: solo tiene `registrarUsuario`, no se importa en ningún HTML — código muerto
- [ ] `alerts/alerts.js`: `mostrarAlerta` no se usa en ningún HTML — código muerto

---

## 🚧 En progreso
- Nada actualmente

---

## ❌ Pendiente (backlog)

### Backend
- [ ] Migrar queries de `pg` raw a Prisma Client
- [ ] Agregar carpeta `routes/` separada
- [ ] Agregar carpeta `services/` con lógica de negocio
- [ ] Validaciones con Zod
- [ ] Versionar API → `/api/v1/`
- [ ] Agregar modelos: `Finca`, `Vacuna`, `Historial`
- [ ] `errorHandler` middleware global

### Frontend
- [ ] Migrar a React + Vite
- [ ] Implementar PWA (manifest + service worker)
- [ ] IndexedDB para almacenamiento local
- [ ] SyncService — sincronización automática al recuperar conexión
- [ ] AutofillService — autocompletar desde chapeta
- [ ] Manejo de token expirado → redirect a login
