@echo off
title SkillNest Frontend (React Vite :5173)
echo ========================================================
echo Starting SkillNest Frontend on http://localhost:5173 ...
echo ========================================================
cd /d "%~dp0frontend"
npm run dev -- --port 5173
pause
