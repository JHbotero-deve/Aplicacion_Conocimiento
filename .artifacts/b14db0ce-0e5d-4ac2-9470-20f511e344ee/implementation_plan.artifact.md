# Plan de Auditoría y Navegación "Irrompible"

Este plan detalla la revisión exhaustiva y corrección de todos los flujos de navegación, botones y conexiones API del sistema para asegurar una experiencia de usuario fluida y profesional.

## Objetivos de la Auditoría

> [!IMPORTANT]
> **Navegación Contextual**: Los botones "Volver" deben llevar al usuario a su dashboard específico según su rol (Admin, Mayordomo, Veterinario, Ganadero).
> **Blindaje de Sesión**: Todas las páginas protegidas deben verificar la existencia del token al cargar.
> **Unificación de Interfaz**: Estandarizar el comportamiento del Menú Hamburguesa en todos los dispositivos móviles.

---

## Proposed Changes

### 1. Estandarización de Navegación (Frontend)

#### [MODIFY] [Todos los Dashboards](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/frontend/forms/)
- Implementar la función `toggleSidebar()` de forma idéntica en Admin, Veterinario y Mayordomo.
- Asegurar que el botón de "Cerrar Sesión" limpie el `localStorage` y redirija a `login.html`.

#### [MODIFY] [Formularios Operativos](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/frontend/forms/)
- Actualizar el botón "Volver" en `tratamientos.html`, `produccion.html`, `inventario.html` y `novedades.html`.
- **Lógica Inteligente**: El botón detectará el rol del usuario guardado en el token y lo regresará a su dashboard correspondiente en lugar de un archivo fijo.

### 2. Blindaje de Conexión API

#### [MODIFY] [server.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/server.js)
- Re-activar y ajustar la **Content Security Policy (CSP)** de Helmet de forma equilibrada para permitir Tailwind y FontAwesome sin comprometer la seguridad.
- Asegurar que todas las rutas estáticas se sirvan correctamente.

### 3. Verificación de Rutas y Botones

#### [REVISE] [registro_ganado.html](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/frontend/forms/registro_ganado.html)
- Corregir el script de envío para que use la misma lógica de "Respuesta del Sistema" que el login.
- Eliminar bloques de script duplicados detectados.

---

## Verification Plan

### Pruebas de Flujo Completo
- Entrar como **Ganadero**, registrar una novedad, y pulsar "Volver" (debe ir a `ganadero_dashboard.html`).
- Entrar como **Veterinario**, registrar un tratamiento, y pulsar "Volver" (debe ir a `veterinario_dashboard.html`).
- Intentar entrar a un dashboard pegando la URL directamente sin estar logueado (debe redirigir a `login.html`).

### Verificación de Consola
- Confirmar que no hay errores 404 de archivos CSS/JS ni errores de CORS/CSP al navegar entre secciones.

## Resumen de Commits (VCS)
- Se realizará el commit: `Arquitectura: Unificación de flujos de navegación, protección de rutas y corrección de enlaces contextuales`.
