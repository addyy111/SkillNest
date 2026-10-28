Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "        Launching SkillNest Full-Stack Platform        " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Starting Spring Boot backend (:8080)...' -ForegroundColor Green; .\mvnw.cmd spring-boot:run"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'Starting React Vite frontend (:5173)...' -ForegroundColor Green; npm run dev -- --port 5173"

Write-Host "`nBoth servers have been launched in separate terminal windows." -ForegroundColor Green
Write-Host "Backend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
