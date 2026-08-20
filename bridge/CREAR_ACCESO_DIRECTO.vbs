Set WshShell = CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
strPath = WshShell.CurrentDirectory

' Crear el acceso directo en el escritorio
Set oShortCut = WshShell.CreateShortcut(strDesktop & "\Ganaderia Pro.lnk")
oShortCut.TargetPath = "wscript.exe"
oShortCut.Arguments = """" & strPath & "\INICIAR_GANADERIA_PRO.vbs"""
oShortCut.WorkingDirectory = strPath
oShortCut.Description = "Sistema de Gestion Pecuaria de Precision"
' Si el usuario pone un archivo logo.ico en esa ruta, se vera el icono real
If CreateObject("Scripting.FileSystemObject").FileExists(strPath & "\frontend\assets\img\logo.ico") Then
    oShortCut.IconLocation = strPath & "\frontend\assets\img\logo.ico"
End If
oShortCut.Save

MsgBox "¡Acceso directo creado en el Escritorio con exito!", 64, "Ganaderia Pro"
