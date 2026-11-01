<#
.SYNOPSIS
  Automated Release Publisher for Angel Generator AI
.DESCRIPTION
  Automatically packages, documents, and publishes a new GitHub Release whenever
  changes are made to the codebase. Generates comprehensive release notes covering:
  - What Changed / Added
  - What Was Removed / Replaced
  - Why the Change Was Made
  - How It Helps the User
#>

[CmdletBinding()]
param(
  [Parameter(Mandatory=$false)]
  [string]$Version,

  [Parameter(Mandatory=$false)]
  [string]$Title,

  [Parameter(Mandatory=$false)]
  [string]$WhatChanged,

  [Parameter(Mandatory=$false)]
  [string]$WhatRemoved,

  [Parameter(Mandatory=$false)]
  [string]$Why,

  [Parameter(Mandatory=$false)]
  [string]$HowItHelps,

  [Parameter(Mandatory=$false)]
  [switch]$Auto
)

$ErrorActionPreference = "Stop"
$RepoRoot = $PSScriptRoot
Set-Location $RepoRoot

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   ✦ Angel Generator AI — Automated Release Publisher" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Determine Latest Release & Next Version Tag
$latestTag = ""
try {
  $releaseJson = gh release list --limit 1 --json tagName | ConvertFrom-Json
  if ($releaseJson -and $releaseJson.Count -gt 0) {
    $latestTag = $releaseJson[0].tagName
  }
} catch {
  Write-Warning "Could not fetch existing releases via gh CLI. Defaulting baseline."
}

if (-not $latestTag) { $latestTag = "v3.5.0" }
Write-Host "Current Latest Tag: $latestTag" -ForegroundColor DarkGray

if (-not $Version) {
  # Auto-bump patch: e.g. v3.5.0 -> v3.5.1
  if ($latestTag -match '^v?(\d+)\.(\d+)\.(\d+)') {
    $major = [int]$matches[1]
    $minor = [int]$matches[2]
    $patch = [int]$matches[3] + 1
    $Version = "v$major.$minor.$patch"
  } else {
    $Version = "v3.5.1"
  }
}
Write-Host "Target Version:     $Version" -ForegroundColor Green

# 2. Extract Recent Commit Info If Notes Not Provided
if (-not $WhatChanged -or -not $Why) {
  $lastCommitMsg = (git log -1 --pretty=format:"%s")
  $diffStat = (git diff HEAD~1 --stat 2>$null | Out-String)
  if (-not $WhatChanged) {
    $WhatChanged = "Recent updates: $lastCommitMsg`n`nFile changes:`n$diffStat"
  }
  if (-not $WhatRemoved) {
    $WhatRemoved = "Cleaned up deprecated temporary artifacts and superseded configurations."
  }
  if (-not $Why) {
    $Why = "Continuous integration update to keep web studio, native engine, and release packages in sync."
  }
  if (-not $HowItHelps) {
    $HowItHelps = "Ensures users always have the latest offline binaries, updated documentation, and polished web studio features."
  }
}

if (-not $Title) {
  $Title = "✦ Angel Generator AI $Version Release"
}

# 3. Format Comprehensive Release Notes
$notes = @"
# ✦ Angel Generator AI $Version

> **Live Web Studio**: [https://michaelsweet612.github.io/Angel_Generator_AI_Images/](https://michaelsweet612.github.io/Angel_Generator_AI_Images/)
> **Widescreen Terminal**: [https://michaelsweet612.github.io/Angel_Generator_AI_Images/ANGEL_GENERATOR_STUDIO.html](https://michaelsweet612.github.io/Angel_Generator_AI_Images/ANGEL_GENERATOR_STUDIO.html)

---

### 🌟 What Changed & Added
$WhatChanged

---

### 🗑️ What Was Removed or Replaced
$WhatRemoved

---

### 🔍 Why the Change Was Made
$Why

---

### 💡 How It Helps the User
$HowItHelps

---

### 📦 Standalone Package Details
- Complete offline bundle: `Angel_Generator_AI_Win64_$Version.zip`
- Includes native 64-bit engine (`AI_Image_Generator.exe`), 16-D model weights, Gemini web studio, and PowerShell automation tools.
- 100% self-contained & offline synthesis.
"@

$notesFile = [System.IO.Path]::GetTempFileName()
Set-Content -Path $notesFile -Value $notes -Encoding UTF8

# 4. Package Release ZIP
$zipName = "Angel_Generator_AI_Win64_$Version.zip"
$zipPath = Join-Path $RepoRoot $zipName
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Write-Host "Packaging standalone distribution: $zipName..." -ForegroundColor Cyan

$zipItems = @(
  "AI_Image_Generator.exe",
  "model_weights.txt",
  "model_config.json",
  "MODEL_ARCHITECTURE.txt",
  "run_windows.bat",
  "Start-AngelGUI.ps1",
  "Start-AngelWeb.ps1",
  "New-AngelImage.ps1",
  "Invoke-BatchGenerator.ps1",
  "Install-Dependencies.ps1",
  "Test-AngelGenerator.ps1",
  "AngelAI.psm1",
  "ANGEL_GENERATOR_STUDIO.html",
  "index.html",
  "app.js",
  "style.css",
  "web",
  "src",
  "samples",
  "AI generated image library",
  "README.md",
  "LICENSE"
)

# Use python or native zip to package accurately
python -c @"
import zipfile, os
base_dir = r'$RepoRoot'
zip_path = r'$zipPath'
items = [$( ($zipItems | ForEach-Object { "'$_'" }) -join ', ' )]
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for item in items:
        full_path = os.path.join(base_dir, item)
        if os.path.isdir(full_path):
            for root, dirs, files in os.walk(full_path):
                for f in files:
                    file_full = os.path.join(root, f)
                    arcname = os.path.relpath(file_full, base_dir)
                    zf.write(file_full, arcname)
        elif os.path.isfile(full_path):
            zf.write(full_path, item)
print('Package created:', zip_path)
"@

# 5. Push any uncommitted / unpushed changes to git
Write-Host "Synchronizing Git branch..." -ForegroundColor Cyan
git push origin main 2>$null

# 6. Publish to GitHub Releases
Write-Host "Publishing GitHub Release $Version..." -ForegroundColor Yellow
try {
  gh release create $Version $zipPath `
    --title $Title `
    --notes-file $notesFile `
    --latest
  Write-Host "✓ Release $Version published successfully!" -ForegroundColor Green
  Write-Host "  URL: https://github.com/michaelsweet612/Angel_Generator_AI_Images/releases/tag/$Version" -ForegroundColor Cyan
} catch {
  Write-Error "Failed to publish release: $_"
}

# 7. Trigger GitHub Pages Build
try {
  gh api -X POST repos/michaelsweet612/Angel_Generator_AI_Images/pages/builds | Out-Null
  Write-Host "✓ GitHub Pages build triggered." -ForegroundColor Green
} catch {}

if (Test-Path $notesFile) { Remove-Item $notesFile -Force }
Write-Host "============================================================" -ForegroundColor Cyan
