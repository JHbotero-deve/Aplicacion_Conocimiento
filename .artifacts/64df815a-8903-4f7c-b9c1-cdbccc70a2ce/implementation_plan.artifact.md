# Plan de Respaldo y Seguridad de Datos (Backup)

Este plan detalla la implementación de un sistema de copias de seguridad de "un solo clic" para proteger la información de la finca contra fallos de hardware o errores humanos.

## Objetivos
1.  **Backup de Un Clic:** Crear un script automatizado que el administrador pueda ejecutar sin conocimientos técnicos.
2.  **Formato Estándar:** Usar `pg_dump` para generar archivos `.sql` compatibles con cualquier instalación de PostgreSQL.
3.  **Visibilidad en el Dashboard:** Añadir una sección en el panel de control para que el administrador recuerde realizar sus respaldos.

## User Review Required

> [!IMPORTANT]
> **Almacenamiento Externo:** Se recomendará al administrador copiar los archivos generados en la carpeta `backups/` a una memoria USB o a la nube (Google Drive/OneDrive) regularmente.
> **Integridad:** El backup se puede realizar con el sistema encendido sin interrumpir el trabajo de los operarios en campo.

## Proposed Changes

### [Infraestructura] Automatización de Respaldos

#### [NEW] [EXPORTAR_BACKUP.bat](file:///C:/Workspace_Dev/1_Proyectos/Aplicacion_Conocimiento/EXPORTAR_BACKUP.bat)
- Script por lotes que ejecuta `docker exec` para extraer la base de datos completa.
- Organiza los archivos por fecha (ej. `backup_ganaderia_2026_08_17.sql`).

### [Frontend] Panel Administrativo

#### [MODIFY] [admin_dashboard.html](file:///C:/Workspace_Dev/1_Proyectos/Aplicacion_Conocimiento/frontend/forms/admin_dashboard.html)
- Añadir un bloque de "Seguridad de Datos" en la barra lateral o en la sección de Resumen.
- Incluir un botón visual de "Exportar Base de Datos" con instrucciones claras.

### [Documentación]
- Actualizar la `guia_entrega_administrador.artifact.md` con la sección de "Protección de Datos".

## Verification Plan

### Manual Verification
- Ejecutar el `.bat` y verificar que se crea un archivo `.sql` válido en la carpeta `backups/`.
- Abrir el archivo `.sql` con un editor de texto para confirmar que contiene las tablas `ganado`, `usuarios`, etc.
