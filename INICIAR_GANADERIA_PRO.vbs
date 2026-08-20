Set WshShell = CreateObject("WScript.Shell")
' Lanza el script de carga de forma invisible
WshShell.Run "cmd /c INICIAR_SISTEMA.bat", 0, False
