# Plan de Refuerzo Security Edge 2.0: Validación Total y Estabilidad de Voz

Este plan aborda los fallos de validación en el registro inicial de ganado y corrige los bloqueos de seguridad que impiden el funcionamiento del asistente de voz.

## Resumen de Hallazgos (Protocolo Security Edge)

> [!CAUTION]
> **Falla de Cobertura**: El motor de validación actual solo protege la producción, pero deja la "puerta abierta" en el registro inicial de ganado (`/ganado`).
> **Bloqueo de Voz (CSP)**: Las políticas de seguridad están impidiendo que el motor de voz del navegador se comunique con los servicios de reconocimiento, provocando el error de decodificación.

---

## Proposed Changes

### 1. Blindaje Universal de Datos (Anti-Fraude)

#### [MODIFY] [businessValidator.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/middleware/businessValidator.js)
- **Extender validación a `/ganado`**:
    - Bloquear pesos > 1,500 kg en el registro inicial.
    - Bloquear edades > 300 meses (25 años) por ser biológicamente improbables para producción.
    - Asegurar que el `finca_id` sea un UUID válido antes de procesar.

### 2. Solución al Error de Voz (Conectividad)

#### [MODIFY] [server.js](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/backend/server.js)
- **Ajuste de CSP para Web Speech API**: Añadir `https://*.google.com` y `https://*.googleapis.com` a las directivas de `connect-src` y `script-src`, ya que Chrome y Android utilizan estos servicios para el reconocimiento de voz en la nube.

#### [MODIFY] [registro_ganado.html](file:///C:/Workspace_Dev/1_Proyectos/proyecto_ganaderia/frontend/forms/registro_ganado.html)
- Mejorar el reporte de errores de voz para indicar si el problema es de **Permisos**, **Internet** o **Hardware**, en lugar de un mensaje genérico.

---

## Verification Plan

### Prueba de Inyección de Datos
- Intentar registrar un animal de 10,000 kg mediante el formulario oficial. El sistema debe enviarlo a **Cuarentena** y mostrar el aviso de seguridad.

### Verificación de Voz
- Activar el micrófono en Chrome y verificar que los iconos de carga fluyan y el texto se capture correctamente sin el error de decodificación.

## Resumen de Commits (VCS)
- Mensaje: `Seguridad: Validación universal de inventario pecuario y habilitación de servicios de voz en CSP`.
