@echo off
setlocal

:: ============================================
:: Claude Code Web UI — Launcher
:: ============================================
:: Reads API config from ~/.claude/settings.json automatically.
:: No manual env setup needed.

:: Server config
set PORT=3000

cd /d "%~dp0"

:: Build web app if dist doesn't exist
if not exist "web-app\dist\index.html" (
    echo [*] Building web app...
    cd web-app
    call npm install
    call npx vite build
    cd ..
)

echo.
echo  ========================================
echo   Claude Code Web UI
echo  ========================================
echo   Web App:  http://localhost:%PORT%/app/
echo   Legacy:   http://localhost:%PORT%/code/
echo   Health:   http://localhost:%PORT%/health
echo  ========================================
echo.

bun run src/index.ts
