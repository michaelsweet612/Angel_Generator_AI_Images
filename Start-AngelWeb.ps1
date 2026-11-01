<#
.SYNOPSIS
    Launches the Angel Generator AI Web Studio and opens your browser.
.EXAMPLE
    .\Start-AngelWeb.ps1
    .\Start-AngelWeb.ps1 -Port 8080
#>
param(
    [int]$Port = 5050,
    [switch]$NoBrowser
)

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ModulePath = Join-Path $PSScriptRoot "AngelAI.psm1"

if (Test-Path $ModulePath) {
    Import-Module $ModulePath -Force
    Start-AngelWeb -Port $Port -NoBrowser:$NoBrowser
} else {
    $ServerScript = Join-Path $PSScriptRoot "src\web_server.py"
    $argsList = @($ServerScript, "--port", $Port.ToString())
    if ($NoBrowser) { $argsList += "--no-browser" }
    python $argsList
}
