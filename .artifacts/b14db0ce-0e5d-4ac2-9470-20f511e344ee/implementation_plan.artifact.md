# Plan de Consolidación: Documentación y Ajustes Finales

Este plan detalla las tareas para actualizar la documentación técnica, los scripts de prueba y la integración de alertas, asegurando que todo el proyecto refleje las mejoras de seguridad e ICA realizadas.

## Proposed Changes

---

### 1. Documentación Técnica y Guías

#### [MODIFY] [README.md](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/README.md)
Actualizar con:
- Instrucciones claras de Docker.
- Descripción del Asistente de Voz y cumplimiento ICA.
- Guía de roles (Admin, Veterinario, Ganadero).

#### [MODIFY] [requests.http](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/requests.http)
Actualizar todas las rutas para:
- Usar el puerto **8000**.
- Incluir los nuevos campos ICA en los ejemplos.
- Añadir las rutas administrativas (`/admin/stats`, `/admin/auditoria`).
- Corregir nombres de campos (ej. `contrasena`).

---

### 2. Auditoría y Alertas Automáticas

#### [MODIFY] [autorevision.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/scripts/autorevision.js)
El script actual busca archivos de texto obsoletos. Se propone:
- Actualizarlo para que consulte la tabla `auditoria` en PostgreSQL.
- Detectar patrones de ataque directamente desde la base de datos.

#### [NEW] [emailService.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/services/emailService.js)
Mover la lógica de envío de correos a un servicio centralizado para que tanto el script de revisión como el middleware de auditoría puedan enviar alertas en tiempo real si se detecta algo grave.

---

### 3. Limpieza de Frontend

#### [MODIFY] [alerts.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/frontend/alerts/alerts.js)
Asegurar que las alertas visuales usen los estilos de Tailwind CSS implementados.

---

### 4. Revisión de Estructura "Bridge"

#### [REVISE] [bridge/](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/bridge/)
Verificar si estos archivos son necesarios o si son restos de configuraciones anteriores de despliegue que deban ser documentados o eliminados.

## Verification Plan

### Pruebas de Documentación
- Seguir paso a paso el `README.md` en un entorno limpio para asegurar que no falte nada.
- Ejecutar todas las peticiones en `requests.http` y verificar que las respuestas sean exitosas.

### Pruebas de Alerta
- Simular un ataque (intentos fallidos) y verificar que el script `autorevision.js` detecte la anomalía en la base de datos.
