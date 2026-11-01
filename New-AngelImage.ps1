<#
.SYNOPSIS
    Generate an AI angel or celestial artwork from the command line.
.EXAMPLE
    .\New-AngelImage.ps1 -Prompt "Archangel Michael with glowing wings" -Open
    .\New-AngelImage.ps1 -Prompt "Seraphim in heavenly golden dawn" -Style Divine_Gold -Resolution 1024x1024
#>
param(
    [Parameter(Position = 0)]
    [string]$Prompt = "Archangel Michael with massive glowing white feathered wings and golden halo in heavenly clouds, divine light rays",

    [ValidateSet("Auto", "Neural", "Cloud", "C_Native")]
    [string]$Engine = "Auto",

    [ValidateSet("Default", "Renaissance", "Divine_Gold", "Cyberpunk", "Celestial")]
    [string]$Style = "Default",

    [string]$Resolution = "512x512",
    [int]$Seed,
    [string]$OutFile,
    [switch]$Open
)

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ModulePath = Join-Path $PSScriptRoot "AngelAI.psm1"

$resParts = $Resolution.ToLower().Split('x')
$w = if ($resParts.Length -ge 2) { [int]$resParts[0] } else { 512 }
$h = if ($resParts.Length -ge 2) { [int]$resParts[1] } else { 512 }

Import-Module $ModulePath -Force

$params = @{
    Prompt = $Prompt
    Engine = $Engine
    Style = $Style
    Width = $w
    Height = $h
    Open = $Open
}
if ($PSBoundParameters.ContainsKey('Seed')) { $params['Seed'] = $Seed }
if ($OutFile) { $params['OutFile'] = $OutFile }

New-AngelImage @params
