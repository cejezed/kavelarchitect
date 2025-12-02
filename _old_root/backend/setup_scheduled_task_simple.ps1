# Eenvoudige versie - werkt zonder administrator rechten
# Maakt een taak aan in de root van Task Scheduler voor de huidige gebruiker

$taskName = "BrikxFundaSync"
$scriptPath = "E:\Funda Wordpress\run_funda_sync.bat"
$workingDir = "E:\Funda Wordpress"

Write-Host "Bezig met aanmaken van geplande taak..." -ForegroundColor Cyan

# Verwijder oude taak indien aanwezig
try {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
} catch {}

# Trigger 1: Dagelijks om 8:00
$trigger1 = New-ScheduledTaskTrigger -Daily -At "08:00"

# Trigger 2: Bij opstarten (met vertraging)
$trigger2 = New-ScheduledTaskTrigger -AtStartup
$trigger2.Delay = "PT2M"

# Actie
$action = New-ScheduledTaskAction -Execute $scriptPath -WorkingDirectory $workingDir

# Instellingen
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1) `
    -DontStopOnIdleEnd

# Maak taak aan voor huidige gebruiker
Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger @($trigger1, $trigger2) `
    -Settings $settings `
    -Description "Automatische sync van Funda bouwgronden naar WordPress" `
    -Force

Write-Host "`n=== SUCCES ===" -ForegroundColor Green
Write-Host "Taak '$taskName' is aangemaakt!" -ForegroundColor Green
Write-Host "`nSchema:" -ForegroundColor Yellow
Write-Host "  - Dagelijks om 08:00 uur" -ForegroundColor White
Write-Host "  - Bij opstarten computer (met 2 min vertraging)" -ForegroundColor White
Write-Host "`nScript: $scriptPath" -ForegroundColor Cyan
Write-Host "`nJe kunt de taak bekijken met: taskschd.msc" -ForegroundColor Yellow
Write-Host "Of direct testen met:" -ForegroundColor Yellow
Write-Host "  Start-ScheduledTask -TaskName '$taskName'" -ForegroundColor Gray
