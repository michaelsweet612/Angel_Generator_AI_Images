<#
.SYNOPSIS
    Runs diagnostic tests across all Angel Generator AI components.
.EXAMPLE
    .\Test-AngelGenerator.ps1
#>
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ModulePath = Join-Path $PSScriptRoot "AngelAI.psm1"

Import-Module $ModulePath -Force
Test-AngelAI
