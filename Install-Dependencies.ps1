<#
.SYNOPSIS
    Installs and verifies all required and optional Python libraries for Angel Generator AI.
.EXAMPLE
    .\Install-Dependencies.ps1
#>
Write-Host "==================================================" -ForegroundColor Yellow
Write-Host "  ANGEL GENERATOR AI — DEPENDENCY INSTALLER       " -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Yellow

$corePackages = @("torch", "pillow", "numpy", "flask", "flask-cors", "requests")
$optionalPackages = @("accelerate", "transformers", "safetensors")

Write-Host "Installing/Verifying Core Dependencies..." -ForegroundColor Cyan
python -m pip install --upgrade $corePackages

Write-Host "`nInstalling Optional AI Optimization Packages..." -ForegroundColor Cyan
python -m pip install --upgrade $optionalPackages

Write-Host "`nVerifying Installation..." -ForegroundColor Green
python -c "import torch, PIL, numpy, flask, requests; print('All core modules imported successfully!')"

Write-Host "`nEnvironment Ready! Run .\Start-AngelWeb.ps1 to launch." -ForegroundColor Yellow
