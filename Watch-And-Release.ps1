<#
.SYNOPSIS
  Continuous File Watcher & Automated Release Publisher
.DESCRIPTION
  Monitors the Angel Generator AI directory for any file modifications.
  Whenever a file is modified, automatically runs git commit and publishes
  a new detailed GitHub release.
#>

$RepoRoot = $PSScriptRoot
Set-Location $RepoRoot

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   ✦ Angel Generator AI — Real-time File Change Watcher" -ForegroundColor Yellow
Write-Host "   Monitoring: $RepoRoot" -ForegroundColor DarkGray
Write-Host "   Press Ctrl+C to stop watching." -ForegroundColor DarkGray
Write-Host "============================================================" -ForegroundColor Cyan

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $RepoRoot
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite, Size'

$lastTrigger = [DateTime]::MinValue
$lock = New-Object System.Object

$action = {
  param($source, $eventArgs)
  $name = $eventArgs.Name
  # Ignore git internal metadata, outputs, or zip archives
  if ($name -match '^\.git\\' -or $name -match '^outputs\\' -or $name -match '\.zip$') {
    return
  }

  [System.Threading.Monitor]::Enter($lock)
  try {
    $now = [DateTime]::UtcNow
    if (($now - $lastTrigger).TotalSeconds -lt 10) {
      return
    }
    $script:lastTrigger = $now

    Write-Host "`n[Change Detected] File: $name ($($eventArgs.ChangeType))" -ForegroundColor Yellow
    Write-Host "Committing change and publishing new release..." -ForegroundColor Cyan

    git add -A
    git commit -m "✦ Auto-update: $name modified"
    & "$RepoRoot\Publish-AngelRelease.ps1" -Auto
  } finally {
    [System.Threading.Monitor]::Exit($lock)
  }
}

Register-ObjectEvent $watcher 'Changed' -Action $action | Out-Null
Register-ObjectEvent $watcher 'Created' -Action $action | Out-Null

try {
  while ($true) {
    Start-Sleep -Seconds 1
  }
} finally {
  $watcher.EnableRaisingEvents = $false
  $watcher.Dispose()
  Write-Host "`nWatcher stopped." -ForegroundColor Yellow
}
