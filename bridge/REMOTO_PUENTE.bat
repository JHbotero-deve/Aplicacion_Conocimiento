@echo off
echo ============================================
echo   PUENTE REMOTO - GANADERIA PRO (CIUDAD-CAMPO)
echo ============================================
echo.
echo Este script creara un link que funciona en CUALQUIER PARTE.
echo Asegurese de que INICIAR_SISTEMA.bat este corriendo.
echo.
echo Paso 1: Instalando herramienta de tunel seguro...
cmd /c "npm install -g localtunnel"
echo.
echo Paso 2: Abriendo el puente global...
echo.
echo >>> COPIE LA URL QUE APARECE ABAJO (ej. https://lucky-cows-jump.loca.lt)
echo >>> Y PEGUELA EN SU NAVEGADOR PARA DARSELA A SUS TRABAJADORES.
echo.
lt --port 8000
pause
