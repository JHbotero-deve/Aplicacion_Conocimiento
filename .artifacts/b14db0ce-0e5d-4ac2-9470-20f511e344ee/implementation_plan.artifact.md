# Plan de Implementación: Ganadería Pro "Security Edge Edition"

Este plan detalla la implementación del sistema de blindaje de seguridad, protección de datos y el protocolo de revisión estricta solicitado.

## User Review Required: Security Edge Protocol

Cada entrega de esta versión seguirá el orden de revisión establecido:
1. **Resumen de errores** (Críticos, Advertencias, Recomendaciones).
2. **Compilación y Dependencias**.
3. **Compatibilidad** (Windows, Linux, Android/Termux).
4. **Documentación** (UTF-8, Ortografía, Markdown).
5. **Calidad de Código** (Lógica, Nomenclatura, Arquitectura).
6. **Git y GitHub** (Commits limpios, .gitignore).
7. **Seguridad** (Inyección, XSS, Fraude de Datos).

---

## Hallazgos de Revisión Previa (Baseline)

> [!WARNING]
> **Riesgo de Datos Incoherentes**: Actualmente el sistema permite registrar cualquier valor numérico (ej. 10,000 litros de leche), lo cual corrompe las estadísticas.
> **Exposición de Servidor**: El servidor Express revela que usa `X-Powered-By: Express`, facilitando ataques dirigidos.
> **Sin Límite de Peticiones**: Una sola IP podría saturar el sistema y dejarlo fuera de servicio.

---

## Proposed Changes

### 1. Blindaje de Infraestructura (Hardening)

#### [MODIFY] [server.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/server.js)
- Implementar **Helmet** para proteger cabeceras HTTP.
- Configurar **Rate Limiting** para prevenir ataques DoS (100 peticiones por 15 min).

### 2. Motor de Validación y Cuarentena (Anti-Fraude)

#### [MODIFY] [init.sql](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/models/init.sql)
- **Nueva tabla `cuarentena`**: Almacenará registros sospechosos para auditoría manual.

#### [NEW] [businessValidator.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/middleware/businessValidator.js)
Motor de reglas que desviará a `cuarentena` si:
- Producción > 50L/día por animal.
- Venta > 30% del hato en un solo día.
- Peso ganado/perdido > 60kg en una semana.

### 3. Sistema de Alertas Rojas

#### [MODIFY] [emailService.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/services/emailService.js)
- Añadir función `alertarFraude` que enviará un correo con los datos de la cuarentena.

### 4. Seguridad de Versión (VCS)

- Se realizará un **Commit previo** (ya ejecutado) para asegurar que no se pierda la historia.
- Se realizarán **Commits granulares** por cada componente de seguridad implementado.

## Verification Plan

### Automated Tests
- Simular ingreso de 1,000 litros de leche y verificar que la respuesta sea "Registro en revisión por seguridad".
- Verificar que el dato aparezca en la tabla `cuarentena` y no en `produccion`.

### Security Audit
- Escaneo de cabeceras con `curl -I` para confirmar que Helmet está activo.
- Intento de fuerza bruta para confirmar bloqueo de IP.
