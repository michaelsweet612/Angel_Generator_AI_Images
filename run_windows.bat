@echo off
title ScratchGen-T2I v1.0 - From-Scratch AI Text-to-Image Generator (Windows x64)
cls
echo ====================================================================
echo   ScratchGen-T2I v1.0 - Windows x64 Standalone Launcher
echo ====================================================================
echo.
if not "%~1"=="" (
    AI_Image_Generator.exe "%~1" "%~2" "%~3"
    goto :eof
)
AI_Image_Generator.exe
