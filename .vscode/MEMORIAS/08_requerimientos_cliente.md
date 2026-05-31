# 08 — Requerimientos del Cliente

## Requerimientos funcionales
- Registrar ganado con campos ICA (chapeta, raza, edad, peso, fecha_ingreso, estadoICA, certificado_ica)
- Buscar animal por número de chapeta
- Ver historial veterinario por animal
- Registrar vacunaciones
- Bloquear registros de ganado
- Gestión de usuarios con roles (admin, usuario, veterinario, operador)
- Login con autenticación JWT

## Requerimientos operativos (campo)
- **Funcionar sin internet** — offline-first obligatorio
- **Instalable en celular** — PWA
- **Interfaz simple** — usuarios con baja alfabetización digital
- **Mínima escritura manual** — autocompletar desde chapeta
- **Sincronización automática** — al recuperar conexión, subir cambios pendientes

## Requerimientos técnicos
- Backend Node.js + Express + PostgreSQL
- Autenticación JWT
- Cumplir campos exigidos por ICA Colombia para trazabilidad
- Docker para despliegue
