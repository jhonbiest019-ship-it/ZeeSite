@echo off
title B&M Stores Real-Time Live Sync
echo ===================================================================
echo Starting B&M Stores 100%% Real-Time Live Sync at http://localhost:8080/
echo ===================================================================
start /b powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
timeout /t 2 /nobreak >nul
start "" "http://localhost:8080/"
echo Running! Live synced with https://www.bmstores.co.uk/
pause
