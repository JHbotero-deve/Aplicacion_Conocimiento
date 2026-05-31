# 10 — Seguridad

## Implementado
- [x] JWT obligatorio en endpoints de ganado
- [x] Contraseñas con bcrypt (costo 10)
- [x] Variables sensibles en `.env`
- [x] Validación de inputs en backend antes de consultar DB
- [x] Verificación de JWT_SECRET vacío antes de firmar token

## Pendiente para producción
- [ ] JWT_SECRET de 64+ caracteres aleatorios
- [ ] CORS restringido a dominio real
- [ ] HTTPS obligatorio
- [ ] Rate limiting en `/login` y `/register`
- [ ] `.env` en `.gitignore` — verificar que no sube al repositorio

## Reglas permanentes
- Nunca exponer `contrasena_hash` en respuestas de la API
- Nunca loguear datos sensibles en consola en producción
- Roles de usuario: `admin`, `usuario`, `veterinario`, `operador`
- Solo `admin` puede listar todos los usuarios
