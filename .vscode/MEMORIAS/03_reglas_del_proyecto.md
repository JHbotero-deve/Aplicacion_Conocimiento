# 03 — Reglas del Proyecto

## Reglas técnicas obligatorias

### Backend
- No mezclar ESM (`import`) con CommonJS (`require`) en el mismo contexto
- Todo endpoint protegido debe pasar por middleware JWT
- Variables sensibles SOLO en `.env`, nunca en código
- Contraseñas siempre con bcrypt (costo 10)
- Validar inputs antes de tocar base de datos
- Retornar errores estructurados: `{ error: "...", detalle: "..." }`

### Frontend
- No duplicar lógica de fetch en cada HTML — usar `services/api.js`
- Enviar números como `Number()`, no como string desde formularios
- El `name` de los inputs debe coincidir exactamente con el campo que se envía
- El token JWT se guarda en `localStorage` con clave `"token"`
- Todo formulario debe leer el token antes de llamar endpoints protegidos

### Base de datos
- Usar Prisma como ORM oficial
- No escribir SQL crudo salvo en `models/db.js` mientras se migra a Prisma completo
- `chapeta` es identificador único del animal — nunca duplicar

## Reglas de experiencia de usuario (UX)
- El usuario NO debe escribir información que el sistema ya tiene
- Al seleccionar chapeta → cargar automáticamente todos los datos del animal
- Máximo 3 acciones por pantalla
- Botones grandes (uso en campo desde celular)
- Preferir selectores sobre campos de texto libre
- La app debe funcionar offline — no depender del backend en tiempo real

## Reglas de nomenclatura
- Campos en español snake_case: `nombre_usuario`, `fecha_ingreso`, `rol_usuario`
- Archivos JS en camelCase: `ganadoService.js`, `authMiddleware.js`
- Rutas en kebab-case: `/api/v1/registro-ganado`
