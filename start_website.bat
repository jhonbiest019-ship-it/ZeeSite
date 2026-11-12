@echo off
title Local Web Server
echo ===================================================================
echo Starting Local Web Server at http://localhost:8080/
echo ===================================================================
start "" "http://localhost:8080/"
node "%~dp0server.js"
pause
