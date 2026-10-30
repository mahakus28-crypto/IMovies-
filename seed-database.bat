@echo off
set "PATH=%~dp0.tools\node;%PATH%"
cd /d "%~dp0server"
echo ==============================================
echo 🍿 Seeding IMovies Database...
echo ==============================================
npm run seed
pause
