@echo off
cd /d "C:\Users\Jorge Botero\OneDrive\Desktop\Aplicacioon_Conocimiento"
echo === STATUS ===
git status --short
echo.
echo === LAST 5 COMMITS ===
git log --oneline -5
echo.
echo === DIFF STAGED ===
git diff --cached --stat
echo.
echo === DIFF UNSTAGED ===
git diff --stat
