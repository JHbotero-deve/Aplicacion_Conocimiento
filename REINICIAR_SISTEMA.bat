@echo off
setlocal enabledelayedexpansion
title Ganaderia Pro - Mantenimiento Inteligente

echo.
echo ================================================================
echo       GANADERIA PRO - REINICIO Y DIAGNOSTICO DE EMERGENCIA
echo ================================================================
echo.

:: 1. Diagnostico previo
echo [1/4] Analizando estado de contenedores...
docker-compose ps
echo.

set /p confirm="¿Desea aplicar correccion y reinicio completo? (S/N): "
if /i "%confirm%" neq "S" exit /b

echo.
echo [2/4] Deteniendo servicios y limpiando errores de red...
docker-compose down --remove-orphans

echo [3/4] Re-inicializando infraestructura Steel Edge...
docker-compose up -d --build

echo [4/4] Verificando restablecimiento del servicio...
set "RETRY=0"
:health_check
curl -s http://localhost:8000/health | findstr "available" >nul
if %errorlevel% neq 0 (
    set /a RETRY+=1
    if !RETRY! gtr 10 (
        echo [!] El sistema requiere atencion manual. Verifique Docker Desktop.
        pause
        exit /b
    )
    echo ... re-conectando (!RETRY!/10) ...
    timeout /t 2 /nobreak >nul
    goto health_check
)

echo.
echo [LISTO] Sincronizando y abriendo aplicacion corporativa...
docker-compose exec -T backend npm run seed
start http://localhost:8000/forms/login.html

echo.
echo ================================================================
echo      EL SISTEMA SE HA RESTABLECIDO CORRECTAMENTE ✅
echo ================================================================
echo.
pause
