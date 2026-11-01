<#
.SYNOPSIS
    Re-exports model weights and JSON configuration.
.EXAMPLE
    .\Export-AngelModel.ps1
#>
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ModulePath = Join-Path $PSScriptRoot "AngelAI.psm1"

Import-Module $ModulePath -Force
Export-AngelModel
