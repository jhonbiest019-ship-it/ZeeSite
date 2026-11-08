@echo off
title Deploy ZeeSite to Vercel
echo ===================================================================
echo               Deploying ZeeSite to Vercel
echo ===================================================================
echo.
echo Option 1: Web 1-Click Import (Recommended)
echo Opening your repository in Vercel...
start "" "https://vercel.com/new/import?s=https://github.com/jhonbiest019-ship-it/ZeeSite"
echo.
echo Simply click the 'Deploy' button on the Vercel page!
echo.
echo Option 2: Deploy via Vercel CLI
set /p CHOICE="Do you want to deploy right now from this terminal? (y/n): "
if /i "%CHOICE%"=="y" (
    vercel deploy --prod
)
pause
