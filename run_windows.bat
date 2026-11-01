@echo off
setlocal enabledelayedexpansion
title Angel Generator AI Studio v2.5 - 4K Ultra-HD

echo =======================================================================
echo          ANGEL GENERATOR AI — MULTI-ENGINE CELESTIAL STUDIO            
echo =======================================================================
echo  [1] Launch Interactive Web Studio (Browser + Real-time Canvas)
echo  [2] Launch Desktop Window Studio (4K Ultra-HD & High Thinking GUI)
echo  [3] Generate 4K Archangel Artwork Now (PowerShell CLI)
echo  [4] Run Comprehensive Diagnostic Health Check
echo  [5] Run Native 64-bit Windows C Binary (AI_Image_Generator.exe)
echo  [0] Exit
echo =======================================================================
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo Launching Web Studio...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-AngelWeb.ps1"
    goto end
)
if "%choice%"=="2" (
    echo Launching Desktop Window Studio...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-AngelGUI.ps1"
    goto end
)
if "%choice%"=="3" (
    echo Synthesizing 4K Archangel Artwork...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0New-AngelImage.ps1" -Prompt "Archangel Michael with glowing white feathered wings and golden halo in heavenly clouds, divine light rays" -Style Renaissance -Resolution 1024x1024 -Open
    pause
    goto end
)
if "%choice%"=="4" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Test-AngelGenerator.ps1"
    pause
    goto end
)
if "%choice%"=="5" (
    echo Running standalone C executable...
    "%~dp0AI_Image_Generator.exe"
    pause
    goto end
)

:end
endlocal
