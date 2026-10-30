@echo off
set "PATH=%~dp0.tools\node;%PATH%"
cd /d "%~dp0server"
echo ==============================================
echo 🎬 Starting IMovies Backend API Server...
echo 🌐 Listening on: http://localhost:5000
echo ==============================================
npm start
pause
