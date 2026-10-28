@echo off
title SkillNest Launcher
echo ========================================================
echo       Launching SkillNest Full-Stack Platform           
echo ========================================================
echo 1. Starting Spring Boot Backend in new window...
start "SkillNest Backend (:8080)" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"
timeout /t 3 /nobreak >nul
echo 2. Starting React Vite Frontend in new window...
start "SkillNest Frontend (:5173)" cmd /k "cd /d %~dp0frontend && npm run dev -- --port 5173"
echo.
echo Both servers launched!
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo ========================================================
timeout /t 5 >nul
