@echo off
setlocal enabledelayedexpansion

:: 1. Mostrar Splash Screen (Ventana de Carga Visual)
echo ^<html^>^<head^>^<title^>Iniciando Ganaderia Pro^</title^>^<style^>body{background:#064e3b;color:white;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;overflow:hidden;} .loader{border:4px solid #f3f3f3;border-top:4px solid #10b981;border-radius:50%%;width:30px;height:30px;animation:spin 2s linear infinite;} @keyframes spin{0%%{transform:rotate(0deg);}100%%{transform:rotate(360deg);}}^</style^>^<script^>window.resizeTo(400,300);window.moveTo((screen.width-400)/2,(screen.height-300)/2);^</script^>^</head^>^<body^>^<h2 style='margin-bottom:10px;'^>GANADERIA PRO^</h2^>^<div class='loader'^>^</div^>^<p style='margin-top:20px;font-size:12px;opacity:0.7;'^>Preparando infraestructura de campo...^</p^>^</body^>^</html^> > splash.hta
start "" mshta.exe "%cd%\splash.hta"

:: 2. Verificar/Lanzar Docker
docker info >nul 2>&1
if %errorlevel% neq 0 (
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    :: Esperar pacientemente
    timeout /t 20 /nobreak >nul
)

:: 3. Levantar sistema en silencio
docker-compose up -d --build >nul 2>&1

:: 4. Esperar salud del sistema
:wait_loop
timeout /t 2 /nobreak >nul
curl -s http://localhost:8000/health | findstr "available" >nul
if %errorlevel% neq 0 goto wait_loop

:: 5. Cerrar Splash Screen y abrir App Real
taskkill /F /IM mshta.exe >nul 2>&1
del splash.hta

:: 6. Crear Acceso Directo si no existe (Toque Premium)
if not exist "%USERPROFILE%\Desktop\Ganaderia Pro.lnk" (
    wscript.exe "%cd%\bridge\CREAR_ACCESO_DIRECTO.vbs"
)

:: Abrir en Modo Aplicación (Sin barras de navegador)
start msedge --app=http://localhost:8000/index.html
if %errorlevel% neq 0 start chrome --app=http://localhost:8000/index.html

exit
