# Docker production environment management script for Windows PowerShell

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    
    [Parameter(Position=1)]
    [string]$Service = "",
    
    [Parameter(Position=2)]
    [string]$Replicas = ""
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# Check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker Desktop and try again."
        exit 1
    }
}

# Check if production environment file exists
function Test-ProductionEnvironment {
    if (-not (Test-Path ".env.production")) {
        Write-Error ".env.production file not found. Please create it with production values."
        exit 1
    }
}

# Build production images
function Build-Images {
    Write-Status "Building production Docker images..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Production build completed successfully!"
    } else {
        Write-Error "Production build failed!"
        exit 1
    }
}

# Deploy to production
function Deploy-Production {
    Write-Status "Deploying to production..."
    
    # Build images
    Build-Images
    
    # Start services
    docker-compose -f docker-compose.prod.yml up -d
    
    if ($LASTEXITCODE -eq 0) {
        # Wait for services to be ready
        Write-Status "Waiting for services to be ready..."
        Start-Sleep -Seconds 30
        
        # Run health checks
        Test-Health
        
        Write-Status "Production deployment completed!"
        Write-Status "Application is available at your configured domain"
    } else {
        Write-Error "Production deployment failed!"
        exit 1
    }
}

# Stop production environment
function Stop-Environment {
    Write-Status "Stopping production environment..."
    docker-compose -f docker-compose.prod.yml down
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Production environment stopped!"
    }
}

# Update production deployment
function Update-Production {
    Write-Status "Updating production deployment..."
    
    # Build new images
    Build-Images
    
    # Rolling update
    docker-compose -f docker-compose.prod.yml up -d --no-deps app
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Production update completed!"
    } else {
        Write-Error "Production update failed!"
    }
}

# View production logs
function Show-Logs {
    param([string]$ServiceName)
    
    if ($ServiceName) {
        docker-compose -f docker-compose.prod.yml logs -f --tail=100 $ServiceName
    } else {
        docker-compose -f docker-compose.prod.yml logs -f --tail=100
    }
}

# Health check
function Test-Health {
    Write-Status "Running health checks..."
    
    # Check application health
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Status "✓ Application is healthy"
        } else {
            Write-Error "✗ Application health check failed (Status: $($response.StatusCode))"
        }
    }
    catch {
        Write-Error "✗ Application health check failed: $($_.Exception.Message)"
    }
    
    # Check database health
    try {
        docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U postgres | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "✓ Database is healthy"
        } else {
            Write-Error "✗ Database health check failed"
        }
    }
    catch {
        Write-Error "✗ Database health check failed: $($_.Exception.Message)"
    }
    
    # Check Redis health
    try {
        docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "✓ Redis is healthy"
        } else {
            Write-Error "✗ Redis health check failed"
        }
    }
    catch {
        Write-Error "✗ Redis health check failed: $($_.Exception.Message)"
    }
}

# Backup database
function Backup-Database {
    Write-Status "Creating database backup..."
    
    # Create backups directory if it doesn't exist
    if (-not (Test-Path "backups")) {
        New-Item -ItemType Directory -Path "backups" | Out-Null
    }
    
    $backupFile = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
    
    try {
        docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres expense_tracker > "backups\$backupFile"
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Database backup created: backups\$backupFile"
        } else {
            Write-Error "Database backup failed!"
        }
    }
    catch {
        Write-Error "Database backup failed: $($_.Exception.Message)"
    }
}

# Restore database from backup
function Restore-Database {
    param([string]$BackupFile)
    
    if (-not $BackupFile) {
        Write-Error "Please specify backup file: .\scripts\docker-prod.ps1 restore <backup_file>"
        exit 1
    }
    
    if (-not (Test-Path "backups\$BackupFile")) {
        Write-Error "Backup file not found: backups\$BackupFile"
        exit 1
    }
    
    $response = Read-Host "This will overwrite the current database. Are you sure? (y/N)"
    if ($response -match "^[yY]") {
        Write-Status "Restoring database from backup: $BackupFile"
        try {
            Get-Content "backups\$BackupFile" | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d expense_tracker
            if ($LASTEXITCODE -eq 0) {
                Write-Status "Database restore completed!"
            } else {
                Write-Error "Database restore failed!"
            }
        }
        catch {
            Write-Error "Database restore failed: $($_.Exception.Message)"
        }
    } else {
        Write-Status "Restore cancelled."
    }
}

# Scale services
function Scale-Service {
    param([string]$ServiceName, [string]$ReplicaCount)
    
    if (-not $ServiceName -or -not $ReplicaCount) {
        Write-Error "Usage: .\scripts\docker-prod.ps1 scale <service> <replicas>"
        exit 1
    }
    
    Write-Status "Scaling $ServiceName to $ReplicaCount replicas..."
    docker-compose -f docker-compose.prod.yml up -d --scale "$ServiceName=$ReplicaCount"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Scaling completed!"
    } else {
        Write-Error "Scaling failed!"
    }
}

# Show system status
function Show-Status {
    Write-Status "Production system status:"
    docker-compose -f docker-compose.prod.yml ps
    
    Write-Host ""
    Write-Status "Resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

# Show help
function Show-Help {
    Write-Host "Docker Production Environment Management (PowerShell)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\scripts\docker-prod.ps1 [COMMAND] [OPTIONS]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  build       Build production Docker images"
    Write-Host "  deploy      Deploy to production"
    Write-Host "  update      Update production deployment"
    Write-Host "  stop        Stop production environment"
    Write-Host "  logs        View logs (optionally specify service name)"
    Write-Host "  health      Run health checks"
    Write-Host "  backup      Create database backup"
    Write-Host "  restore     Restore database from backup"
    Write-Host "  scale       Scale service replicas"
    Write-Host "  status      Show system status"
    Write-Host "  help        Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\scripts\docker-prod.ps1 deploy"
    Write-Host "  .\scripts\docker-prod.ps1 logs app"
    Write-Host "  .\scripts\docker-prod.ps1 scale app 3"
    Write-Host "  .\scripts\docker-prod.ps1 backup"
}

# Main script logic
function Main {
    Test-Docker
    
    switch ($Command.ToLower()) {
        "build" {
            Test-ProductionEnvironment
            Build-Images
        }
        "deploy" {
            Test-ProductionEnvironment
            Deploy-Production
        }
        "update" {
            Test-ProductionEnvironment
            Update-Production
        }
        "stop" {
            Stop-Environment
        }
        "logs" {
            Show-Logs -ServiceName $Service
        }
        "health" {
            Test-Health
        }
        "backup" {
            Backup-Database
        }
        "restore" {
            Restore-Database -BackupFile $Service
        }
        "scale" {
            Scale-Service -ServiceName $Service -ReplicaCount $Replicas
        }
        "status" {
            Show-Status
        }
        "help" {
            Show-Help
        }
        default {
            Write-Error "Unknown command: $Command"
            Show-Help
            exit 1
        }
    }
}

# Run the main function
Main