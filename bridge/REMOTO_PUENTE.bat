@echo off
setlocal
title Ganaderia Pro - Modo Remoto Activo

echo ================================================================
echo       ESTABLECIENDO ENLACE SEGURO CIUDAD-CAMPO
echo ================================================================
echo.

:: Verificar si el tunel ya existe
lt --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [SISTEMA] Preparando conexion global (Paso unico)...
    cmd /c "npm install -g localtunnel" >nul 2>&1
)

echo.
echo >>> El sistema esta creando su Link Global Privado.
echo.

:: Lanzar localtunnel y extraer la URL para que el usuario no vea la terminal
start /b lt --port 8000 > tunnel.log
timeout /t 5 /nobreak >nul

for /f "tokens=*" %%a in ('findstr "your url is" tunnel.log') do set "URL=%%a"
set "URL=%URL:your url is: =%"

echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo   SU LINK DE WHATSAPP ES: %URL%
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo.
echo Pegue este link en su navegador y envielo a sus trabajadores.
echo No cierre esta ventana para mantener el enlace activo.
echo.
pause
