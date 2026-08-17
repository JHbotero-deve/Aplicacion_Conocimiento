# Guía de Entrega para el Administrador (PC Central)

Esta guía explica paso a paso cómo poner en marcha el sistema **Ganadería Pro** en una computadora nueva desde cero.

## 1. Requisitos Previos
Antes de empezar, la computadora debe tener instalado:
1.  **Docker Desktop:** Es el motor que hace funcionar la base de datos blindada. [Descargar aquí](https://www.docker.com/products/docker-desktop/).
2.  **Node.js (Opcional pero recomendado):** Para herramientas de soporte. [Descargar aquí](https://nodejs.org/).

## 2. Puesta en Marcha (Primer Uso)
Una vez que el administrador tenga la carpeta del proyecto en su PC:

1.  **Abrir Docker Desktop:** Asegúrese de que el icono de la ballena esté en verde (indica que el motor está activo).
2.  **Ejecutar el Sistema:**
    - Busque en la carpeta raíz el archivo llamado `INICIAR_SISTEMA.bat`.
    - Haga doble clic en él.
    - Se abrirá una ventana negra que descargará e instalará automáticamente todo lo necesario. **No la cierre hasta que diga "Servidor en http://localhost:8000"**.
3.  **Entrar a la Aplicación:**
    - Abra su navegador (Chrome o Edge recomendado).
    - Ingrese a la dirección: `http://localhost:8000`.

## 3. Configuración Inicial
1.  **Crear Administrador:** Si es la primera vez, use el botón "Empezar Ahora" o "Crear cuenta" para registrar el usuario principal.
2.  **Asignar Finca:** En el panel de administración, registre el nombre de su unidad de producción (finca).

## 4. Cómo conectar a los trabajadores (Móviles)
Este es el paso más importante para el uso en campo:
1.  En el Dashboard del Administrador, haga clic en el botón **"Generar Acceso Móvil"** (el del icono QR).
2.  Se abrirá una pestaña con un código QR grande.
3.  Pida a cada operario que escanee ese código con su celular.
4.  **IMPORTANTE:** Asegúrese de que el PC y los celulares estén conectados a la **misma red WiFi**.

## 5. Mantenimiento Diario
- **Encendido:** Cada mañana, el administrador debe verificar que el archivo `.bat` esté corriendo.
- **Apagado:** Puede cerrar la ventana negra al final de la jornada; los datos se guardarán automáticamente en la carpeta `data/` de forma segura.

## 6. Protección de Datos (Backups)
Es vital que el administrador proteja la información histórica contra robos o fallos de la computadora:
1.  **Ejecutar Backup:** En la carpeta del proyecto, haga doble clic en `EXPORTAR_BACKUP.bat`.
2.  **Verificar:** Se creará un archivo con la fecha de hoy en la carpeta `backups/`.
3.  **Resguardo Externo:** Copie esos archivos a una memoria USB o súbalos a la nube regularmente.

---

> [!TIP]
> **Soporte Offline:** Recuerde que el personal puede seguir trabajando sin WiFi una vez que hayan escaneado el código e instalado la app. Solo necesitan volver a acercarse al WiFi del PC para que los datos se sincronicen.

> [!CAUTION]
> **Seguridad:** No borre la carpeta `data/` que se creará automáticamente, ya que allí reside la base de datos blindada con toda la información de la finca.
