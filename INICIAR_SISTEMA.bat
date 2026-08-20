@echo off
setlocal enabledelayedexpansion
title Ganaderia Pro - Lanzador Corporativo Inteligente

:: Paleta de Colores ANSI (si es compatible)
set "GREEN=[32m"
set "CYAN=[36m"
set "YELLOW=[33m"
set "RED=[31m"
set "RESET=[0m"

echo.
echo !CYAN!================================================================!RESET!
echo !GREEN!      GANADERIA PRO - SISTEMA DE GESTION DE PRECISION         !RESET!
echo !CYAN!================================================================!RESET!
echo.

:: 1. Deteccion de IP Local para el Admin
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address" /c:"Dirección IPv4"') do (
    set "LOCAL_IP=%%a"
    set "LOCAL_IP=!LOCAL_IP: =!"
)

echo !YELLOW![INFO]!RESET! Su IP de red es: !LOCAL_IP!
echo !YELLOW![INFO]!RESET! Puerto de operacion: 8000
echo.

:: 2. Verificar Puerto 8000
netstat -ano | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo !RED![ALERTA]!RESET! El puerto 8000 ya esta siendo usado.
    echo Por favor, cierre cualquier otra instancia de la aplicacion.
    pause
    exit /b
)

:: 3. Verificar/Lanzar Docker
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo !YELLOW![SISTEMA]!RESET! Docker no responde. Intentando abrir Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Esperando a que Docker inicie (puede tardar 1-2 minutos)...
    :docker_wait
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        timeout /t 5 /nobreak >nul
        goto docker_wait
    )
)

echo !GREEN![1/4]!RESET! Levantando infraestructura blindada...
docker-compose up -d --build

echo !GREEN![2/4]!RESET! Verificando estabilidad del nucleo (Health Check)...
set "RETRY=0"
:health_check
curl -s http://localhost:8000/health | findstr "available" >nul
if %errorlevel% neq 0 (
    set /a RETRY+=1
    if !RETRY! gtr 15 (
        echo !RED![ERROR]!RESET! El nucleo no responde. Use REINICIAR_SISTEMA.bat.
        pause
        exit /b
    )
    echo ... esperando enlace central (!RETRY!/15) ...
    timeout /t 2 /nobreak >nul
    goto health_check
)

echo !GREEN![3/4]!RESET! Sincronizando bases de datos y seguridad...
docker-compose exec -T backend npm run seed

echo !GREEN![4/4]!RESET! ¡EXITO! Redireccionando al Acceso Real...
:: Abrimos directo el Login Corporativo Premium
start http://localhost:8000/forms/login.html

echo.
echo !CYAN!================================================================!RESET!
echo !GREEN!      SISTEMA OPERATIVO - AUDITORIA ACTIVA (STEEL EDGE)       !RESET!
echo !CYAN!================================================================!RESET!
echo.
echo Para moviles, use: http://!LOCAL_IP!:8000
echo.
docker-compose logs -f
