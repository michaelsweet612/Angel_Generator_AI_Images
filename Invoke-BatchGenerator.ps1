<#
.SYNOPSIS
    Batch generates a gallery of celestial images.
.EXAMPLE
    .\Invoke-BatchGenerator.ps1 -Style Renaissance
    .\Invoke-BatchGenerator.ps1 -Prompts "Archangel Michael", "Golden Seraphim", "Cathedral Guardian"
#>
param(
    [string[]]$Prompts,
    [string]$PromptFile,
    [string]$OutDir = "outputs\batch",
    [string]$Style = "Renaissance"
)

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ModulePath = Join-Path $PSScriptRoot "AngelAI.psm1"

Import-Module $ModulePath -Force

$params = @{
    OutDir = $OutDir
    Style = $Style
}
if ($Prompts) { $params['Prompts'] = $Prompts }
if ($PromptFile) { $params['PromptFile'] = $PromptFile }

Invoke-AngelBatch @params
