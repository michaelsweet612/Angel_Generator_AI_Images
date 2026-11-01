<#
.SYNOPSIS
    AngelAI PowerShell Module - Celestial Text-to-Image Generation Suite

.DESCRIPTION
    Provides native PowerShell cmdlets to generate AI images, launch the interactive
    Web Studio, perform batch generation, run diagnostics, and manage model weights.

.EXAMPLE
    Import-Module .\AngelAI.psm1
    New-AngelImage -Prompt "Archangel Michael with glowing wings" -Style Renaissance -Open
#>

$Script:ModuleRoot = $PSScriptRoot
if (-not $Script:ModuleRoot) {
    $Script:ModuleRoot = (Get-Location).Path
}

function Get-AngelPythonPath {
    $py = Get-Command python -ErrorAction SilentlyContinue
    if ($py) { return $py.Source }
    $py3 = Get-Command python3 -ErrorAction SilentlyContinue
    if ($py3) { return $py3.Source }
    throw "Python was not found in PATH. Please install Python 3.10+ from python.org."
}

function Get-AngelPresets {
    <#
    .SYNOPSIS
        Returns curated angelic and celestial prompts.
    #>
    [CmdletBinding()]
    param()

    return @(
        [PSCustomObject]@{
            Id = "archangel"
            Title = "Archangel Michael Divine Guardian"
            Prompt = "Archangel Michael with glowing golden wings, flaming divine sword, golden halo, volumetric celestial light, masterpiece, 8k"
            Style = "Renaissance"
        },
        [PSCustomObject]@{
            Id = "seraphim"
            Title = "Six-Winged Seraphim in Heavenly Dawn"
            Prompt = "Magnificent six-winged Seraphim surrounded by celestial clouds, radiant golden halo, sacred light beams, ethereal beauty"
            Style = "Divine_Gold"
        },
        [PSCustomObject]@{
            Id = "cathedral"
            Title = "Guardian Angel Over Cathedral"
            Prompt = "Guardian angel with pure white feathered wings overlooking sacred gothic cathedral spire, golden sunset, divine presence"
            Style = "Renaissance"
        },
        [PSCustomObject]@{
            Id = "cyberpunk"
            Title = "Cyberpunk Holographic Angel"
            Prompt = "Futuristic cyberpunk holographic angel with glowing neon cyan wings overlooking rainy neon skyscraper metropolis, scifi"
            Style = "Cyberpunk"
        },
        [PSCustomObject]@{
            Id = "cosmic"
            Title = "Cosmic Angel Born in Nebula"
            Prompt = "Celestial divine angel silhouette emerging from deep space galaxy nebula, glowing starlight, cosmic purple and gold aura"
            Style = "Celestial"
        }
    )
}

function New-AngelImage {
    <#
    .SYNOPSIS
        Synthesizes an AI image from a text prompt.
    .EXAMPLE
        New-AngelImage -Prompt "Seraphim with flaming halo" -Style Divine_Gold -Open
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $false, Position = 0)]
        [string]$Prompt = "Archangel Michael with glowing white feathered wings and golden halo in heavenly clouds, divine light rays",

        [Parameter(Mandatory = $false)]
        [ValidateSet("Auto", "Neural", "C_Native")]
        [string]$Engine = "Auto",

        [Parameter(Mandatory = $false)]
        [ValidateSet("Default", "Renaissance", "Divine_Gold", "Cyberpunk", "Celestial")]
        [string]$Style = "Default",

        [Parameter(Mandatory = $false)]
        [int]$Width = 512,

        [Parameter(Mandatory = $false)]
        [int]$Height = 512,

        [Parameter(Mandatory = $false)]
        [int]$Seed,

        [Parameter(Mandatory = $false)]
        [string]$OutFile,

        [Parameter(Mandatory = $false)]
        [switch]$Open
    )

    $py = Get-AngelPythonPath
    $cliScript = Join-Path $Script:ModuleRoot "src\angel_generator.py"

    if (-not $OutFile) {
        $timestamp = (Get-Date).ToString("yyyyMMdd_HHmmss")
        $outputsDir = Join-Path $Script:ModuleRoot "AI generated image library"
        if (-not (Test-Path $outputsDir)) { New-Item -ItemType Directory -Path $outputsDir | Out-Null }
        $OutFile = Join-Path $outputsDir "angel_$timestamp.png"
    } else {
        $OutFile = [System.IO.Path]::GetFullPath($OutFile)
    }

    $engineArg = $Engine.ToLower()
    $styleArg = $Style.ToLower()

    $argsList = @(
        $cliScript,
        "--prompt", $Prompt,
        "--engine", $engineArg,
        "--style", $styleArg,
        "--width", $Width.ToString(),
        "--height", $Height.ToString(),
        "--out", $OutFile
    )

    if ($PSBoundParameters.ContainsKey('Seed')) {
        $argsList += @("--seed", $Seed.ToString())
    }

    Write-Host "==================================================" -ForegroundColor Yellow
    Write-Host "       ANGEL GENERATOR AI — SYNTHESIS             " -ForegroundColor Yellow
    Write-Host "==================================================" -ForegroundColor Yellow
    Write-Host " Prompt : $Prompt" -ForegroundColor White
    Write-Host " Engine : $Engine" -ForegroundColor Cyan
    Write-Host " Style  : $Style" -ForegroundColor Cyan
    Write-Host " Output : $OutFile" -ForegroundColor Gray

    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    & $py $argsList

    if ($LASTEXITCODE -eq 0 -and (Test-Path $OutFile)) {
        $sw.Stop()
        Write-Host " Generated successfully in $($sw.Elapsed.TotalSeconds.ToString('F2'))s!" -ForegroundColor Green
        if ($Open) {
            Start-Process $OutFile
        }
        return [PSCustomObject]@{
            Success = $true
            Path = (Resolve-Path $OutFile).Path
            Prompt = $Prompt
            Engine = $Engine
            Duration = $sw.Elapsed.TotalSeconds
        }
    } else {
        Write-Error "Failed to generate image. Process exited with code $LASTEXITCODE."
    }
}

function Start-AngelGUI {
    <#
    .SYNOPSIS
        Launches the Angel Generator AI Native Desktop Window Studio.
    #>
    [CmdletBinding()]
    param()

    $py = Get-AngelPythonPath
    $guiScript = Join-Path $Script:ModuleRoot "src\gui_app.py"

    Write-Host "==================================================" -ForegroundColor Yellow
    Write-Host "    LAUNCHING ANGEL GENERATOR AI DESKTOP STUDIO   " -ForegroundColor Yellow
    Write-Host "==================================================" -ForegroundColor Yellow
    Write-Host " Initializing 4K Ultra-HD & High Thinking Desktop Window..." -ForegroundColor Cyan

    & $py $guiScript
}

function Start-AngelWeb {
    <#
    .SYNOPSIS
        Starts the Angel Generator AI Web Studio and opens the browser.
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $false)]
        [int]$Port = 5050,

        [Parameter(Mandatory = $false)]
        [switch]$NoBrowser
    )

    $py = Get-AngelPythonPath
    $serverScript = Join-Path $Script:ModuleRoot "src\web_server.py"

    Write-Host "==================================================" -ForegroundColor Yellow
    Write-Host "     LAUNCHING ANGEL GENERATOR AI WEB STUDIO      " -ForegroundColor Yellow
    Write-Host "==================================================" -ForegroundColor Yellow
    Write-Host " URL: http://127.0.0.1:$Port" -ForegroundColor Cyan
    Write-Host " Press Ctrl+C in this console to stop the server." -ForegroundColor Gray

    $argsList = @($serverScript, "--port", $Port.ToString())
    if ($NoBrowser) { $argsList += "--no-browser" }

    & $py $argsList
}

function Invoke-AngelBatch {
    <#
    .SYNOPSIS
        Batch generates multiple celestial images from a prompt list or file.
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $false)]
        [string[]]$Prompts,

        [Parameter(Mandatory = $false)]
        [string]$PromptFile,

        [Parameter(Mandatory = $false)]
        [string]$OutDir = "outputs\batch",

        [Parameter(Mandatory = $false)]
        [string]$Style = "Renaissance"
    )

    $resolvedPrompts = @()
    if ($PromptFile -and (Test-Path $PromptFile)) {
        $resolvedPrompts += Get-Content $PromptFile | Where-Object { $_.Trim() -and -not $_.StartsWith("#") }
    }
    if ($Prompts) {
        $resolvedPrompts += $Prompts
    }
    if ($resolvedPrompts.Count -eq 0) {
        # Use built-in presets if none specified
        $resolvedPrompts = (Get-AngelPresets).Prompt
    }

    $targetDir = Join-Path $Script:ModuleRoot $OutDir
    if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }

    Write-Host "Starting batch generation of $($resolvedPrompts.Count) prompts..." -ForegroundColor Yellow

    $results = @()
    for ($i = 0; $i -lt $resolvedPrompts.Count; $i++) {
        $p = $resolvedPrompts[$i]
        $out = Join-Path $targetDir ("batch_{0:D3}.png" -f ($i + 1))
        Write-Progress -Activity "Generating Angel Art" -Status "Image $($i + 1)/$($resolvedPrompts.Count)" -PercentComplete ((($i + 1) / $resolvedPrompts.Count) * 100)
        $res = New-AngelImage -Prompt $p -Style $Style -OutFile $out
        if ($res) { $results += $res }
    }

    Write-Progress -Activity "Generating Angel Art" -Completed
    Write-Host "Batch generation complete! $($results.Count) images saved to $targetDir" -ForegroundColor Green
    return $results
}

function Test-AngelAI {
    <#
    .SYNOPSIS
        Comprehensive health check of all Angel Generator AI subsystems.
    #>
    [CmdletBinding()]
    param()

    Write-Host "==================================================" -ForegroundColor Yellow
    Write-Host "       ANGEL GENERATOR AI — DIAGNOSTICS           " -ForegroundColor Yellow
    Write-Host "==================================================" -ForegroundColor Yellow

    $py = Get-AngelPythonPath
    Write-Host " [OK] Python runtime: $py" -ForegroundColor Green

    # Test PyTorch
    $torchCheck = & $py -c "import torch; print(torch.__version__)" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " [OK] PyTorch Engine: version $torchCheck" -ForegroundColor Green
    } else {
        Write-Host " [WARN] PyTorch check failed: $torchCheck" -ForegroundColor Red
    }

    # Test Pillow
    $pilCheck = & $py -c "import PIL; print(PIL.__version__)" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " [OK] Pillow Imaging: version $pilCheck" -ForegroundColor Green
    } else {
        Write-Host " [WARN] Pillow check failed: $pilCheck" -ForegroundColor Red
    }

    # Test Flask
    $flaskCheck = & $py -c "import flask; print(flask.__version__)" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " [OK] Flask Web Server: version $flaskCheck" -ForegroundColor Green
    } else {
        Write-Host " [WARN] Flask check failed: $flaskCheck" -ForegroundColor Red
    }

    # Test C Executable
    $exePath = Join-Path $Script:ModuleRoot "AI_Image_Generator.exe"
    if (Test-Path $exePath) {
        $exeSize = (Get-Item $exePath).Length
        Write-Host " [OK] Standalone Win64 C Executable present ($([math]::Round($exeSize/1KB, 1)) KB)" -ForegroundColor Green
    } else {
        Write-Host " [WARN] C executable not found at $exePath" -ForegroundColor Yellow
    }

    # Test Model Weights
    $weightsPath = Join-Path $Script:ModuleRoot "model_weights.txt"
    if (Test-Path $weightsPath) {
        $lines = (Get-Content $weightsPath).Count
        Write-Host " [OK] Model Weights file present ($lines lines)" -ForegroundColor Green
    } else {
        Write-Host " [WARN] model_weights.txt not found" -ForegroundColor Yellow
    }

    # Test Web Studio files
    $webHtml = Join-Path $Script:ModuleRoot "web\index.html"
    if (Test-Path $webHtml) {
        Write-Host " [OK] Web Studio files present (HTML/CSS/JS)" -ForegroundColor Green
    } else {
        Write-Host " [WARN] Web Studio directory missing" -ForegroundColor Yellow
    }

    Write-Host "==================================================" -ForegroundColor Yellow
    Write-Host " All primary subsystems ready for image synthesis!" -ForegroundColor Cyan
}

function Export-AngelModel {
    <#
    .SYNOPSIS
        Re-exports model weights and JSON configuration.
    #>
    [CmdletBinding()]
    param()

    $py = Get-AngelPythonPath
    $trainScript = Join-Path $Script:ModuleRoot "src\train_and_export_weights.py"
    Write-Host "Rebuilding model weights and vocabulary..." -ForegroundColor Yellow
    & $py $trainScript
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Model weights successfully updated!" -ForegroundColor Green
    }
}

Export-ModuleMember -Function New-AngelImage, Start-AngelWeb, Start-AngelGUI, Get-AngelPresets, Invoke-AngelBatch, Test-AngelAI, Export-AngelModel
