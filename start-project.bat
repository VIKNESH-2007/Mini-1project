@echo off
title GamiLearn Rural Platform - Full Stack Launcher
echo ============================================================================
echo   GamiLearn Rural Platform - Starting All Modules (Backend + Frontend)
echo ============================================================================
echo.
echo [1/2] Launching ASP.NET Core 10.0 Backend API (Gamiweb) on http://localhost:5000 ...
start "Gamiweb Backend API (Port 5000)" cmd /k "cd /d "%~dp0Gamiweb" && dotnet run --urls http://localhost:5000"

echo [2/2] Launching React Frontend (my-gami) on http://localhost:3000 ...
start "GamiLearn Frontend UI (Port 3000)" cmd /k "cd /d "%~dp0my-gami" && npm start"

echo.
echo ============================================================================
echo   Both Backend and Frontend are starting in separate windows!
echo   - Frontend Application : http://localhost:3000
echo   - Backend Swagger API  : http://localhost:5000/swagger
echo ============================================================================
pause
