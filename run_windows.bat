@echo off
setlocal enabledelayedexpansion
title Angel Generator AI Studio v3.0 - 4K Ultra-HD Masterpiece Edition
color 0E

cls
echo ===============================================================================
echo       _____   _   _   ____   _____   _         ___    ___ 
echo      ^|  _  ^| ^| \ ^| ^| ^| ___^| ^| ____^| ^| ^|       / _ \  ^|_ _^|
echo      ^| ^|_^| ^| ^|  \^| ^| ^| ^|_    ^| ^|_    ^| ^|      / /_\ \  ^| ^| 
echo      ^|  _  ^| ^| ^|\  ^| ^|  _^]   ^|  _^]   ^| ^|___   ^|  _  ^|  ^| ^| 
echo      ^|_^| ^|_^| ^|_^| \_^| ^|____^|  ^|_____^| ^|_____^|  ^|_^| ^|_^| ^|___^|
echo.
echo           ANGEL GENERATOR AI — 4K CELESTIAL MASTERPIECE STUDIO
echo           Zero-Dependency PE32+ • PyTorch 4K • WebGL Studio Suite
echo ===============================================================================
echo.
echo   [1] Launch Interactive Web Studio (Browser + Real-time Canvas)
echo   [2] Launch Native Desktop Window Studio (4K Ultra-HD & High Thinking GUI)
echo   [3] Synthesize 4K Archangel Artwork Now (Instant Render to /outputs)
echo   [4] Run Comprehensive Diagnostic Health Check
echo   [5] Run Native 64-bit Standalone C Binary (AI_Image_Generator.exe)
echo   [0] Exit
echo.
echo ===============================================================================
set /p choice="  Select an option [1-5]: "

if "%choice%"=="1" (
    echo.
    echo  [+] Launching Web Studio on http://127.0.0.1:5050 ...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-AngelWeb.ps1"
    goto end
)
if "%choice%"=="2" (
    echo.
    echo  [+] Initializing Native 4K Desktop Studio Window...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-AngelGUI.ps1"
    goto end
)
if "%choice%"=="3" (
    echo.
    echo  [+] Synthesizing 4K Archangel Michael Artwork...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0New-AngelImage.ps1" -Prompt "Archangel Michael with massive radiant golden feathered wings, golden halo in heavenly clouds, divine light rays" -Style Renaissance -Resolution 1024x1024 -Open
    pause
    goto end
)
if "%choice%"=="4" (
    echo.
    echo  [+] Running diagnostic test suite...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Test-AngelGenerator.ps1"
    pause
    goto end
)
if "%choice%"=="5" (
    echo.
    echo  [+] Running native C PE32+ executable...
    "%~dp0AI_Image_Generator.exe"
    pause
    goto end
)

:end
endlocal
