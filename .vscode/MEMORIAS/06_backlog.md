# 06 — Backlog

## Backend

### Correcciones inmediatas
- [ ] Corregir bugs en formularios HTML (ver 05_estado_actual.md)
- [ ] Conectar `services/api.js` o eliminarlo
- [ ] Eliminar o usar `alerts/alerts.js`

### Refactorización arquitectura
- [ ] Crear `src/routes/auth.routes.js`
- [ ] Crear `src/routes/ganado.routes.js`
- [ ] Crear `src/services/ganadoService.js`
- [ ] Crear `src/services/authService.js`
- [ ] Crear `src/validators/ganadoValidator.js` (Zod)
- [ ] Crear `src/validators/authValidator.js` (Zod)
- [ ] Crear `src/config/db.js` (mover desde models/)
- [ ] Migrar queries raw a Prisma Client
- [ ] Versionar endpoints → `/api/v1/`
- [ ] Middleware `errorHandler` global

### Nuevos modelos (base de datos)
- [ ] Modelo `Finca` (nombre, ubicación, propietario)
- [ ] Modelo `Vacuna` (tipo, fecha, animal)
- [ ] Modelo `Historial` (eventos veterinarios por animal)
- [ ] Relación `Ganado → Finca`
- [ ] Relación `Ganado → Vacunas`
- [ ] Relación `Ganado → Historial`

### Nuevos endpoints
- [ ] `GET /api/v1/ganado/:id/historial`
- [ ] `POST /api/v1/vacunas`
- [ ] `GET /api/v1/fincas`
- [ ] `POST /api/v1/fincas`
- [ ] `GET /api/v1/sync` — estado sincronización

## Frontend

### Migración React + Vite
- [ ] Inicializar proyecto con `npm create vite@latest`
- [ ] Configurar Tailwind en Vite
- [ ] Estructura de carpetas (`api/`, `pages/`, `components/`, `storage/`, `sync/`)

### Páginas
- [ ] `LoginPage`
- [ ] `RegistroUsuarioPage`
- [ ] `RegistroGanadoPage`
- [ ] `BuscarChapetaPage`
- [ ] `HistorialAnimalPage`

### Servicios
- [ ] `api/authApi.js` — login, registro
- [ ] `api/ganadoApi.js` — CRUD ganado
- [ ] `storage/indexedDB.js` — guardar datos localmente
- [ ] `sync/syncService.js` — detectar red y sincronizar
- [ ] `offline/offlineManager.js` — modo sin internet

### PWA
- [ ] `manifest.json`
- [ ] Service Worker
- [ ] Íconos para instalación en celular
