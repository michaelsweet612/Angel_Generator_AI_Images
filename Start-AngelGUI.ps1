<#
.SYNOPSIS
    Launches the Angel Generator AI Native Desktop Window Studio.
.EXAMPLE
    .\Start-AngelGUI.ps1
#>
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$GuiScript = Join-Path $PSScriptRoot "src\gui_app.py"

Write-Host "==================================================" -ForegroundColor Yellow
Write-Host "    LAUNCHING ANGEL GENERATOR AI DESKTOP STUDIO   " -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Yellow
Write-Host " Initializing 4K Ultra-HD & High Thinking Desktop Window..." -ForegroundColor Cyan

python $GuiScript
