# PowerShell script om Brikx Funda Sync als geplande taak in te stellen
# Dit script moet met administrator rechten worden uitgevoerd

$taskName = "Brikx Funda Sync"
$taskPath = "\Brikx\"
$scriptPath = "E:\Funda Wordpress\run_funda_sync.bat"
$workingDir = "E:\Funda Wordpress"

# Verwijder bestaande taak indien aanwezig
try {
    Unregister-ScheduledTask -TaskName $taskName -TaskPath $taskPath -Confirm:$false -ErrorAction SilentlyContinue
    Write-Host "Bestaande taak verwijderd" -ForegroundColor Yellow
} catch {
    Write-Host "Geen bestaande taak gevonden" -ForegroundColor Gray
}

# Maak een nieuwe trigger: dagelijks om 8:00
$trigger1 = New-ScheduledTaskTrigger -Daily -At 08:00AM

# Maak een trigger voor bij opstarten (met 2 minuten vertraging om systeem klaar te laten zijn)
$trigger2 = New-ScheduledTaskTrigger -AtStartup
$trigger2.Delay = "PT2M"  # 2 minuten vertraging

# Combineer beide triggers
$triggers = @($trigger1, $trigger2)

# Definieer de actie (wat er moet gebeuren)
$action = New-ScheduledTaskAction -Execute $scriptPath -WorkingDirectory $workingDir

# Instellingen voor de taak
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1)

# Maak de taak aan
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited

# Registreer de taak
Register-ScheduledTask `
    -TaskName $taskName `
    -TaskPath $taskPath `
    -Action $action `
    -Trigger $triggers `
    -Settings $settings `
    -Principal $principal `
    -Description "Automatische sync van Funda bouwgronden naar WordPress sites (kavelarchitect.nl en zwijsen.net)"

Write-Host "`n=== Taak succesvol aangemaakt ===" -ForegroundColor Green
Write-Host "Taaknaam: $taskName" -ForegroundColor Cyan
Write-Host "Schema: Dagelijks om 08:00 + bij opstarten computer" -ForegroundColor Cyan
Write-Host "Script: $scriptPath" -ForegroundColor Cyan
Write-Host "`nJe kunt de taak bekijken in Task Scheduler (taakplanner.msc)" -ForegroundColor Yellow
Write-Host "Of handmatig testen met: Start-ScheduledTask -TaskPath '$taskPath' -TaskName '$taskName'" -ForegroundColor Yellow
