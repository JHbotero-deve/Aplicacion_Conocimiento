# Protocolo de Entrega Corporativa - Ganadería Pro

Este documento certifica la entrega del sistema al Administrador Central. El software ha sido auditado bajo el estándar de seguridad "Steel Edge".

## 1. Acceso al Código Fuente
El sistema reside en el repositorio oficial:
- **Link:** `https://github.com/JHbotero-deve/Aplicacion_Conocimiento.git`
- **Método de descarga:** Botón "Code" -> "Download ZIP".

## 2. Requisitos de Instalación (Solo PC Central)
1. **Docker Desktop:** [Descargar aquí](https://www.docker.com/products/docker-desktop/). Debe estar abierto antes de iniciar el sistema.
2. **Navegador:** Se recomienda Google Chrome o Microsoft Edge.

## 3. Puesta en Marcha (Experiencia Cero Terminal)
1. Localice el archivo **INICIAR_GANADERIA_PRO.vbs** en la raíz de la carpeta.
2. Ejecútelo (doble clic). Aparecerá una ventana de carga profesional: "Iniciando Ganadería Pro...".
3. **Acceso Directo:** El sistema creará automáticamente un icono en su escritorio. Úselo para entrar cada mañana.
4. El sistema se abrirá automáticamente en una ventana limpia (Modo Aplicación), lista para trabajar.

## 4. Conexión de Celulares (Modo Local vs Remoto)

### Opción A: Están en la misma finca (WiFi Local)
1. Su PC debe estar en el mismo WiFi que los celulares.
2. Use el botón **"Generar Acceso Móvil"** y escanee el QR.

### Opción B: Administrador en la ciudad / Campo remoto
Si usted no está físicamente con los trabajadores, el sistema puede crear un "Puente Global":
1. Vaya a la carpeta `bridge/` y ejecute **REMOTO_PUENTE.bat**.
2. Copie el link que aparece (ej. `https://finca-pro.loca.lt`).
3. Envíe ese link por WhatsApp a sus trabajadores.
4. Los trabajadores abren el link e **Instalan la App**. Ahora podrán sincronizar datos desde cualquier lugar con señal de celular.

## 5. El Concepto de Sincronización Local
Este sistema es **"Offline-First"**:
- **En el Potrero:** El trabajador registra datos sin señal alguna.
- **En la Oficina:** Al acercarse al alcance del WiFi de la finca, los datos se sincronizan con la PC automáticamente.
- **Nota:** No confunda WiFi con Internet. Los datos viajan por el aire de su red local hacia su PC, manteniendo la información privada y segura dentro de su propiedad.

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
