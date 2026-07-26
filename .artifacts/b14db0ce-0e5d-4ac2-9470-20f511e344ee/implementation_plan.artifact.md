# Plan de Optimización y Blindaje Total: Versión "Steel Edge"

Este plan aborda tanto los problemas visuales detectados como las vulnerabilidades "silenciosas" (comunes y no tan comunes) que pueden comprometer la estabilidad y privacidad del sistema.

## 🛡️ Resumen de Errores Detectados (Protocolo Security Edge)

> [!CAUTION]
> **Error Crítico de Visualización**: Las políticas de seguridad CSP están bloqueando CDNs, dejando la interfaz sin estilos (Corregido en el servidor, pendiente en UI).
> **Falla de Privacidad (ID Enumeration)**: El uso de IDs secuenciales (#1, #2...) permite a un atacante adivinar cuántos animales o usuarios tienes. Proponemos usar identificadores aleatorios.
> **Falla de Seguridad (CSRF)**: Falta protección contra falsificación de peticiones en sitios cruzados.

---

## Proposed Changes

### 1. Blindaje Visual y Responsividad (Mobile-First)

#### [MODIFY] [admin_dashboard.html](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/frontend/forms/admin_dashboard.html)
- **Menú Hamburguesa**: Implementar sidebar colapsable para que el administrador pueda operar desde su celular en el potrero sin que el menú tape la pantalla.
- **Tablas Adaptativas**: Añadir contenedores con `overflow-x-auto` para que las tablas de ganado no rompan el diseño en pantallas pequeñas.

#### [MODIFY] [Todos los Formularios]
- Ajustar márgenes y tamaños de botones de voz para evitar solapamientos en dispositivos de baja resolución.

### 2. Corrección de Vulnerabilidades Comunes

#### [MODIFY] [init.sql](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/models/init.sql)
- **Migración a UUID**: Cambiar los IDs secuenciales de la tabla `usuarios` y `ganado` por `UUID`. Esto evita que alguien deduzca el tamaño de tu inventario solo mirando la URL.
- **Índices de Rendimiento**: Añadir índices en columnas de búsqueda (chapeta, usuario_id) para evitar caídas del sistema cuando la base de datos crezca a miles de registros.

#### [MODIFY] [package.json](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/package.json)
- Añadir `csurf` o lógica similar para proteger contra ataques CSRF.

### 3. Fortalecimiento de Infraestructura

#### [MODIFY] [backend/Dockerfile](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/Dockerfile)
- **Usuario No-Root**: Configurar Docker para que el proceso de Node.js no corra como administrador (root), limitando el daño en caso de que alguien logre entrar al contenedor.

#### [MODIFY] [server.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/server.js)
- **Manejo de Errores Silencioso**: Asegurar que los errores 500 nunca devuelvan información técnica (stack traces) al usuario, sino un código de incidente único.

### 4. Limpieza de "Basura" y Codificación

#### [DELETE] [Archivos Temporales]
- Limpiar archivos `.log` o carpetas de configuración antiguas detectadas en la raíz.

---

## Verification Plan

### Pruebas de Estrés y Carga
- Simular el crecimiento de la base de datos a 10,000 animales para verificar que los nuevos índices mantienen el sistema rápido.

### Prueba de Penetración (Pentest)
- Intentar adivinar un ID de usuario sumando +1 al actual y verificar que el sistema de UUID lo hace imposible.

### Verificación UI
- Probar la navegación completa usando un solo dedo en un dispositivo móvil (emulación de campo).

## Resumen de Commits (VCS)
- Se realizará el commit en español: `Seguridad Pro: Implementación de IDs únicos (UUID), Docker Hardening y UI Responsiva total`.
