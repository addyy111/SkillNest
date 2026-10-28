@echo off
title SkillNest Backend (Spring Boot :8080)
echo ========================================================
echo Starting SkillNest Backend on http://localhost:8080 ...
echo ========================================================
cd /d "%~dp0backend"
call mvnw.cmd spring-boot:run
pause
