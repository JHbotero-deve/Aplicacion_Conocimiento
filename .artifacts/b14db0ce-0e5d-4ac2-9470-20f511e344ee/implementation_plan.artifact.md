# Plan de Seguridad Blindada y Protección de Datos "Anti-Fraude"

Este plan detalla la implementación de capas de seguridad avanzada para evitar caídas del sistema, robo de datos y, especialmente, la detección de anomalías en el ingreso de información (datos maliciosos o erróneos).

## Estrategia de Seguridad 360°

> [!IMPORTANT]
> **Capa 1: Infraestructura Blindada**: Protección contra ataques de denegación de servicio (DoS) y fuerza bruta mediante límites de peticiones.
> **Capa 2: Integridad de Datos (Cuarentena)**: Los datos que rompan las reglas de negocio (ej. vender más vacas de las que existen) no entrarán a la base de datos principal, sino a una "Zona de Cuarentena" para revisión del Admin.
> **Capa 3: Prevención de Suplantación**: Refuerzo de tokens JWT y cabeceras de seguridad para evitar que un usuario se haga pasar por otro.

## Proposed Changes

---

### 1. Seguridad de Servidor (Hardening)

#### [MODIFY] [server.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/server.js)
- **Implementación de `helmet`**: Oculta detalles técnicos del servidor y previene ataques XSS y de inyección.
- **Rate Limiting**: Limitar el número de peticiones por minuto para evitar que alguien intente "tumbar" el sistema.
- **Validación de Esquema**: Uso de `express-validator` para asegurar que cada campo tenga el formato correcto antes de procesarlo.

---

### 2. Capa de Inteligencia y Cuarentena

#### [MODIFY] [init.sql](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/models/init.sql)
- **Nueva tabla `cuarentena`**: id, usuario_id, tipo_operacion, datos_json, motivo_sospecha, fecha.
- Esta tabla guardará los intentos de ingreso de datos sospechosos.

#### [NEW] [validatorMiddleware.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/middleware/validator.js)
Un motor de reglas de negocio que intercepta los datos antes de guardarlos:
- **Regla de Inventario**: Si se intenta vender/trasladar un animal que no existe o más animales de los que hay en la finca.
- **Regla de Producción**: Si un registro de leche excede los 40 litros/día por vaca (dato atípico).
- **Regla de Peso**: Cambios drásticos de peso (+/- 50kg) en menos de 24 horas.

---

### 3. Sistema de Alertas Rojas

#### [MODIFY] [admin_dashboard.html](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/frontend/forms/admin_dashboard.html)
- **Widget de "Incidentes de Seguridad"**: Un panel rojo que solo aparece si hay datos en cuarentena o intentos de acceso fallidos masivos.
- **Botón de Decisión**: El Administrador podrá "Aprobar" o "Descartar" los datos en cuarentena.

#### [MODIFY] [emailService.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/services/emailService.js)
- Notificación inmediata al Admin cuando un dato entra en cuarentena por sospecha de fraude o error grave.

---

### 4. Blindaje contra Suplantación

#### [MODIFY] [auth.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/middleware/auth.js)
- Añadir verificación de `User-Agent` o IP para asegurar que el token no haya sido robado y usado desde otro dispositivo.

## Verification Plan

### Pruebas de "Ataque"
- Intentar registrar la venta de 100 vacas en una finca que solo tiene 10. Verificar que el sistema envíe el dato a cuarentena y muestre una alerta roja al administrador.
- Realizar 1000 peticiones en un segundo para verificar que el servidor bloquee la IP temporalmente.

### Verificación de Datos
- Comprobar que los datos en cuarentena no alteran los totales (litros, cabezas) del hato hasta que el administrador los apruebe.
