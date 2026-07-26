@echo off
setlocal
title Ganaderia Pro - Mantenimiento

echo ======================================================
echo       GANADERIA PRO - REINICIO DE EMERGENCIA
echo ======================================================
echo.
echo Este proceso limpiara la cache y reiniciara los servicios.
echo Sus datos (fincas, ganado) NO se borraran.
echo.
set /p confirm="¿Desea continuar? (S/N): "
if /i "%confirm%" neq "S" exit /b

echo [1/2] Deteniendo servicios...
docker-compose down

echo [2/2] Limpiando y arrancando de nuevo...
docker-compose up -d --build

echo.
echo Re-sincronizando...
timeout /t 5 /nobreak >nul
docker-compose exec backend npm run seed

echo.
echo [LISTO] El sistema ha sido reiniciado con exito.
pause
