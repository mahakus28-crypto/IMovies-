@echo off
set "PATH=%~dp0.tools\node;%PATH%"
cd /d "%~dp0client"
echo ==============================================
echo 🎬 Starting IMovies Frontend Client...
echo 🌐 Opening on: http://localhost:5173
echo ==============================================
npm run dev
pause
