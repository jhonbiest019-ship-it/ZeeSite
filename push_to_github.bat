@echo off
title Auto Push to GitHub & Deploy to Vercel
echo ===================================================================
echo   Saving changes and triggering Vercel live auto-deployment...
echo ===================================================================
cd /d "%~dp0"

echo [1/3] Adding changes...
git add .

echo [2/3] Committing changes...
git commit -m "Auto-update: %DATE% %TIME%"

echo [3/3] Pushing to GitHub (origin/main)...
git push origin main

echo.
echo ===================================================================
echo Success! Changes pushed to GitHub.
echo Vercel will now automatically rebuild and update your live site!
echo ===================================================================
pause
