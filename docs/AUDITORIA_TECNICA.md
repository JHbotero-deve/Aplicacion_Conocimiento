# Auditoría técnica

Fecha de revisión: 17 de agosto de 2026.

## Verificado

- La API expone un control de salud en `/health` y responde `503` si PostgreSQL no está disponible.
- Las rutas de inicio, registro y recuperación usan el backend del despliegue Docker cuando el frontend se abre en el puerto 8080.
- El inicio de sesión impide envíos repetidos y limita su espera a doce segundos.
- Se usa Helmet, limitación de solicitudes en registro/login, consultas parametrizadas y control de roles para las rutas protegidas.
- La configuración de Docker Compose y la sintaxis de los archivos Node.js revisados son válidas.

## Hallazgos que requieren trabajo planificado

1. **Sin offline real (alto):** cada vista carga recursos desde CDN. Deben compilarse Tailwind y los recursos tipográficos/iconográficos a archivos locales; después debe añadirse un service worker y una cola de sincronización para operaciones pendientes.
2. **Secretos en manifiestos (alto):** `docker-compose.yml` y los manifiestos de `bridge/` contienen credenciales y una clave JWT. Deben migrarse a variables de entorno o secretos del orquestador antes de cualquier despliegue compartido.
3. **Esquema incompleto (alto):** `veterinario.crearCampana` escribe en `campanas_vacunacion`, pero esa tabla no existe en `backend/models/init.sql`.
4. **Consulta de citas para mayordomo (alto):** `veterinario.listarCitas` añade un `JOIN` después de `WHERE`, lo que forma SQL inválido para ese rol.
5. **Alcance de fincas (medio):** el panel de mayordomo consulta `/admin/fincas`, mientras la ruta está restringida a administradores. Se debe definir si el mayordomo ve solo sus fincas asignadas o ninguna; no se cambió sin esa regla funcional.
6. **Validación de entrada (medio):** varios controladores reciben datos sin validar tipo, rango o campos requeridos. Se recomienda incorporar esquemas de validación por ruta.
7. **Renderizado HTML (medio):** paneles administrativos insertan datos de la API con `innerHTML`. Debe reemplazarse por creación de nodos y `textContent` para evitar XSS almacenado.
8. **Sesiones (medio):** el token se conserva en `localStorage`, expuesto ante XSS. Para una aplicación con cuentas reales se recomienda cookie `HttpOnly`, `Secure` y `SameSite`.
9. **Pruebas (alto):** no hay pruebas automatizadas de API, base de datos, interfaz ni responsividad. La integración no se ejecutó porque Docker Desktop no está disponible en este equipo.
10. **Cuenta inicial (alto):** `backend/seed.js` contiene una contraseña de administrador conocida. Debe recibirse una única vez desde una variable de entorno o un asistente de primera instalación, y no permanecer escrita en el repositorio.
11. **Dependencias (bajo):** `npm audit` detecta una vulnerabilidad de severidad baja en `body-parser`; debe actualizarse mediante una revisión controlada de los bloqueos de dependencias.

## Límites de esta revisión

No se modificaron permisos de negocio, datos existentes, contraseñas ni manifiestos de despliegue. Esos cambios requieren confirmar la política de acceso por finca y un mecanismo aprobado para administrar secretos.
