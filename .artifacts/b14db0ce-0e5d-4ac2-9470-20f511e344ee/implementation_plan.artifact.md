# Plan de Implementación: Lanzador "Un Solo Clic" para Usuarios No Técnicos

Este plan detalla la creación de un sistema de arranque automatizado que elimina la necesidad de usar la terminal, pensando en ganaderos y administradores que no tienen conocimientos de programación.

## Decisiones de Diseño

> [!IMPORTANT]
> **Arranque Automatizado**: Se crearán archivos ejecutables (`.bat` para Windows) que realicen todo el trabajo sucio: verificar Docker, descargar dependencias, levantar el servidor y abrir el navegador.
> **Instalación Transparente**: Docker se encargará de todas las librerías internamente sin que el usuario vea mensajes de error de Node.js o npm.

## Proposed Changes

---

### 1. Lanzadores Inteligentes (Windows)

#### [NEW] [INICIAR_SISTEMA.bat](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/INICIAR_SISTEMA.bat)
Script de un solo clic que:
1. Verifica si Docker está activo.
2. Ejecuta `docker-compose up -d --build`.
3. Espera 10 segundos a que la base de datos despierte.
4. Ejecuta el `seed` (usuario admin) automáticamente.
5. Abre el navegador en `http://localhost:8000`.

#### [NEW] [REINICIAR_SISTEMA.bat](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/REINICIAR_SISTEMA.bat)
Script de mantenimiento para solucionar errores técnicos limpiando la caché de Docker.

---

### 2. Integración Continua (GitHub Actions)

#### [NEW] [verify.yml](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/.github/workflows/verify.yml)
Workflow automatizado que se activa al subir código a GitHub:
- **Linting**: Verifica que el código no tenga errores de sintaxis.
- **Build Test**: Intenta construir la imagen Docker del backend para asegurar que no falten dependencias (como pasó con `nodemailer`).
- **Security Audit**: Escanea las dependencias en busca de vulnerabilidades conocidas.

---

### 3. Automatización del Primer Uso

#### [MODIFY] [docker-compose.yml](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/docker-compose.yml)
- Configurar un `healthcheck` para la base de datos, asegurando que el backend espere a que la DB esté 100% lista antes de intentar conectar.

---

### 3. Documentación Visual "Para Humanos"

#### [MODIFY] [README.md](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/README.md)
Añadir una sección de "Inicio Rápido" con iconos:
- Paso 1: Abrir Docker Desktop.
- Paso 2: Doble clic en `INICIAR_SISTEMA.bat`.
- Paso 3: Trabajar.

## Verification Plan

### Prueba de "Usuario Final"
- Cerrar todas las terminales y navegadores.
- Hacer doble clic en el nuevo archivo `.bat`.
- Verificar que el navegador se abra solo y el sistema funcione sin haber tocado el teclado.

### Resiliencia
- Intentar ejecutar el script con Docker apagado y verificar que dé una instrucción clara al usuario: "Por favor, abra Docker Desktop primero".
