@echo off
setlocal
title Ganaderia Pro - Lanzador Automatico

echo ======================================================
echo       GANADERIA PRO - SISTEMA DE GESTION
echo ======================================================
echo.

:: 1. Verificar si Docker esta corriendo
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker no esta abierto.
    echo Por favor, abra "Docker Desktop" y espere a que inicie.
    pause
    exit /b
)

echo [1/4] Levantando servidores...
docker-compose up -d --build

echo [2/4] Esperando a que la base de datos este lista (10s)...
timeout /t 10 /nobreak >nul

echo [3/4] Inicializando usuario administrador...
docker-compose exec backend npm run seed

echo [4/4] Abriendo el panel de control...
start http://localhost:8000

echo.
echo ======================================================
echo   ¡EL SISTEMA ESTA LISTO PARA USAR!
echo   No cierre esta ventana si desea ver los registros.
echo ======================================================
echo.

docker-compose logs -f
