# Ganadería Pro - Sistema de Gestión Pecuaria de Precisión

Aplicación profesional para la administración de fincas, control de ganado, operaciones de campo y sanidad animal. Diseñada específicamente para entornos rurales con conectividad limitada.

## 🚀 Guía de Inicio Rápido (PC Administrador)

Para entregar e instalar el sistema en una PC nueva, siga estos pasos:

1.  **Instalar Docker Desktop:** Descárguelo e instálelo desde [docker.com](https://www.docker.com/). Es fundamental para la base de datos blindada.
2.  **Descargar el Proyecto:** Coloque la carpeta del sistema en un directorio de su preferencia (ej. `C:/GanaderiaPro`).
3.  **Iniciar el Sistema:** Ejecute el archivo `INICIAR_SISTEMA.bat` ubicado en la raíz.
    - El script configurará automáticamente la red local, el backend y la base de datos.
4.  **Acceso Local:** Una vez finalizado el proceso, abra su navegador en `http://localhost:8000`.

## 📱 Acceso para Operarios (Celulares)

El sistema genera accesos dinámicos para facilitar el trabajo en el potrero:

1.  Desde el panel de administración, use el botón **"Generar Acceso Móvil"**.
2.  Escanee el código QR con los celulares de los trabajadores (deben estar en el mismo WiFi).
3.  Instale la aplicación usando el banner **"¿Usar como App?"** que aparecerá en el móvil.

## 🛡️ Pilares del Sistema "Steel Edge"

| Característica | Detalle |
| --- | --- |
| **Offline Total** | Funciona 100% sin internet en el celular tras la primera conexión. |
| **Voz Inteligente** | Reconocimiento con corrección difusa (Levenshtein) para operarios en campo. |
| **Base Blindada** | PostgreSQL aislado de ataques externos mediante Docker. |
| **Sincronización** | Cola de datos cifrada (AES-GCM) que sube al PC en cuanto detecta WiFi. |
| **Sesión Segura** | Cierre automático tras 1 hora de inactividad. |

## 📁 Estructura del Proyecto

- `backend/`: API Node.js, controladores de negocio y seguridad.
- `frontend/`: Interfaz PWA, estilos locales y asistente de voz.
- `bridge/`: Scripts de soporte para redes locales.
- `data/`: Directorio persistente de la base de datos (¡No borrar!).

---
© 2026 Ganadería Pro | Tecnologías de Precisión para el Agro.
