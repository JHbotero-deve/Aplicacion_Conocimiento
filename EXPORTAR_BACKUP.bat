@echo off
setlocal enabledelayedexpansion

:: Configuración
set CONTAINER_NAME=aplicacion_conocimiento-db-1
set DB_USER=ganaderia
set DB_NAME=ganaderia
set BACKUP_DIR=backups

:: Crear carpeta de backups si no existe
if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
    echo Carpeta '%BACKUP_DIR%' creada.
)

:: Generar nombre de archivo con fecha y hora
set TIMESTAMP=%date:~10,4%_%date:~7,2%_%date:~4,2%
set FILENAME=%BACKUP_DIR%\backup_ganaderia_%TIMESTAMP%.sql

echo.
echo ============================================
echo   SISTEMA DE RESPALDO - GANADERIA PRO
echo ============================================
echo Generando copia de seguridad...

:: Ejecutar pg_dump dentro de Docker
docker exec %CONTAINER_NAME% pg_dump -U %DB_USER% %DB_NAME% > "%FILENAME%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [EXITO] Los datos se han guardado en:
    echo %FILENAME%
    echo.
    echo RECOMENDACION: Copie este archivo a una memoria USB o a la nube.
) else (
    echo.
    echo [ERROR] No se pudo realizar la copia.
    echo Asegurese de que el sistema este encendido (INICIAR_SISTEMA.bat).
)

echo.
pause
