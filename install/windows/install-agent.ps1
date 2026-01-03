<#
.SYNOPSIS
    JOS Agent Service installer for Windows.

.DESCRIPTION
    Installs, uninstalls, and manages the JOS Agent Service on Windows.
    The agent connects to JOS Cloud for .jos artifact provisioning.

.PARAMETER Action
    The action to perform: Install, Uninstall, Start, Stop, Status, Register

.EXAMPLE
    .\install-agent.ps1 -Action Install
    .\install-agent.ps1 -Action Register -CloudEndpoint "https://cloud.josfox.mx"
    .\install-agent.ps1 -Action Status
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("Install", "Uninstall", "Start", "Stop", "Status", "Register", "Logs")]
    [string]$Action,
    
    [string]$CloudEndpoint = "https://cloud.josfox.mx",
    [string]$InstallPath = "$env:ProgramFiles\JOS",
    [string]$ConfigPath = "$env:ProgramData\JOS"
)

$ServiceName = "JOSAgentSvc"
$ServiceDisplayName = "JOS Agent Service"
$ServiceDescription = "JOS Open Standard agent for cloud-provisioned artifact execution"

function Write-Status {
    param([string]$Message, [string]$Type = "Info")
    $icon = switch ($Type) {
        "Success" { "✓" }
        "Error" { "✖" }
        "Warning" { "⚠" }
        default { "→" }
    }
    Write-Host "  $icon $Message"
}

function Test-Administrator {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Install-JOSAgent {
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "  JOS Agent Service - Windows Installer" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

    if (-not (Test-Administrator)) {
        Write-Status "Administrator privileges required" "Error"
        exit 1
    }

    # Create directories
    Write-Status "Creating directories..."
    New-Item -ItemType Directory -Force -Path $InstallPath | Out-Null
    New-Item -ItemType Directory -Force -Path $ConfigPath | Out-Null
    New-Item -ItemType Directory -Force -Path "$ConfigPath\logs" | Out-Null
    New-Item -ItemType Directory -Force -Path "$ConfigPath\artifacts" | Out-Null
    Write-Status "Directories created" "Success"

    # Generate agent ID
    $AgentId = [guid]::NewGuid().ToString()
    Write-Status "Generated Agent ID: $AgentId"

    # Create config file
    $config = @{
        agent_id = $AgentId
        platform = "windows"
        hostname = $env:COMPUTERNAME
        cloud_endpoint = $CloudEndpoint
        version = "1.0.0"
        installed_at = (Get-Date -Format "o")
    } | ConvertTo-Json -Depth 3

    $config | Out-File -FilePath "$ConfigPath\agent.json" -Encoding UTF8
    Write-Status "Configuration saved" "Success"

    # Create agent daemon script
    $daemonScript = @'
# JOS Agent Daemon
$ErrorActionPreference = "Continue"
$ConfigPath = "$env:ProgramData\JOS"
$config = Get-Content "$ConfigPath\agent.json" | ConvertFrom-Json

while ($true) {
    try {
        # Heartbeat
        $heartbeat = @{
            agent_id = $config.agent_id
            status = "online"
            timestamp = (Get-Date -Format "o")
        } | ConvertTo-Json
        
        Invoke-RestMethod -Uri "$($config.cloud_endpoint)/api/agents/$($config.agent_id)/heartbeat" `
            -Method POST -Body $heartbeat -ContentType "application/json" -ErrorAction SilentlyContinue
        
        # Poll for provisioned artifacts
        $provision = Invoke-RestMethod -Uri "$($config.cloud_endpoint)/api/agents/$($config.agent_id)/provision" `
            -Method GET -ErrorAction SilentlyContinue
        
        if ($provision.artifact) {
            $artifactPath = "$ConfigPath\artifacts\$($provision.artifact.name)"
            $provision.artifact.content | Out-File -FilePath $artifactPath -Encoding UTF8
            & jos run $artifactPath
        }
    } catch {
        Add-Content -Path "$ConfigPath\logs\agent.log" -Value "$(Get-Date): Error - $_"
    }
    
    Start-Sleep -Seconds 60
}
'@
    $daemonScript | Out-File -FilePath "$InstallPath\jos-agent-daemon.ps1" -Encoding UTF8

    # Create Windows Service using NSSM or native sc
    Write-Status "Creating Windows Service..."
    
    # Use PowerShell to create a simple service wrapper
    $serviceExe = "$InstallPath\JOSAgentSvc.exe"
    
    # For now, register as a scheduled task that runs at startup (simpler than NSSM)
    $taskAction = New-ScheduledTaskAction -Execute "powershell.exe" `
        -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$InstallPath\jos-agent-daemon.ps1`""
    $taskTrigger = New-ScheduledTaskTrigger -AtStartup
    $taskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
    $taskPrincipal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

    Register-ScheduledTask -TaskName $ServiceName -Action $taskAction -Trigger $taskTrigger `
        -Settings $taskSettings -Principal $taskPrincipal -Description $ServiceDescription -Force | Out-Null

    Write-Status "Service registered" "Success"
    Write-Host "`n  Agent ID: $AgentId" -ForegroundColor Green
    Write-Host "  Config: $ConfigPath\agent.json"
    Write-Host "  Logs: $ConfigPath\logs\"
    Write-Host "`n  Run 'install-agent.ps1 -Action Register' to connect to JOS Cloud`n"
}

function Uninstall-JOSAgent {
    Write-Host "`n  Uninstalling JOS Agent Service...`n"
    
    if (-not (Test-Administrator)) {
        Write-Status "Administrator privileges required" "Error"
        exit 1
    }

    # Stop and remove scheduled task
    Unregister-ScheduledTask -TaskName $ServiceName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Status "Service removed" "Success"

    # Optionally remove files (keep config for re-install)
    # Remove-Item -Path $InstallPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Status "Installation files kept at $InstallPath"
    Write-Status "Config files kept at $ConfigPath"
    Write-Host ""
}

function Start-JOSAgent {
    Start-ScheduledTask -TaskName $ServiceName
    Write-Status "JOS Agent started" "Success"
}

function Stop-JOSAgent {
    Stop-ScheduledTask -TaskName $ServiceName
    Write-Status "JOS Agent stopped" "Success"
}

function Get-JOSAgentStatus {
    $task = Get-ScheduledTask -TaskName $ServiceName -ErrorAction SilentlyContinue
    if ($task) {
        $info = Get-ScheduledTaskInfo -TaskName $ServiceName
        Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host "  JOS Agent Service Status" -ForegroundColor Cyan
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan
        Write-Host "  State: $($task.State)"
        Write-Host "  Last Run: $($info.LastRunTime)"
        Write-Host "  Next Run: $($info.NextRunTime)"
        
        if (Test-Path "$ConfigPath\agent.json") {
            $config = Get-Content "$ConfigPath\agent.json" | ConvertFrom-Json
            Write-Host "  Agent ID: $($config.agent_id)"
            Write-Host "  Cloud: $($config.cloud_endpoint)"
        }
        Write-Host ""
    } else {
        Write-Status "JOS Agent is not installed" "Warning"
    }
}

function Register-JOSAgent {
    if (-not (Test-Path "$ConfigPath\agent.json")) {
        Write-Status "Agent not installed. Run Install first." "Error"
        exit 1
    }

    $config = Get-Content "$ConfigPath\agent.json" | ConvertFrom-Json
    
    Write-Host "`n  Registering agent with JOS Cloud..."
    
    $registration = @{
        agent_id = $config.agent_id
        platform = $config.platform
        hostname = $config.hostname
        version = $config.version
        os_info = (Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version)
    } | ConvertTo-Json -Depth 3

    try {
        $response = Invoke-RestMethod -Uri "$($config.cloud_endpoint)/api/agents/register" `
            -Method POST -Body $registration -ContentType "application/json"
        Write-Status "Registered successfully!" "Success"
        Write-Host "  Cloud ID: $($response.cloud_id)" -ForegroundColor Green
    } catch {
        Write-Status "Registration failed: $_" "Error"
    }
    Write-Host ""
}

function Get-JOSAgentLogs {
    $logFile = "$ConfigPath\logs\agent.log"
    if (Test-Path $logFile) {
        Get-Content $logFile -Tail 50
    } else {
        Write-Status "No logs found" "Warning"
    }
}

# Execute action
switch ($Action) {
    "Install"    { Install-JOSAgent }
    "Uninstall"  { Uninstall-JOSAgent }
    "Start"      { Start-JOSAgent }
    "Stop"       { Stop-JOSAgent }
    "Status"     { Get-JOSAgentStatus }
    "Register"   { Register-JOSAgent }
    "Logs"       { Get-JOSAgentLogs }
}
