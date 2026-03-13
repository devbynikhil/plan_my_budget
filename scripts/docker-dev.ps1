# Docker development environment management script for Windows PowerShell

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

# Create environment file if it doesn't exist
function Initialize-Environment {
    if (-not (Test-Path ".env.docker.local")) {
        Write-Warning ".env.docker.local not found. Creating from template..."
        Copy-Item ".env.docker" ".env.docker.local"
        Write-Warning "Please edit .env.docker.local with your actual values before running the application."
    }
}

# Build development images
function Build-Images {
    Write-Status "Building development Docker images..."
    docker-compose -f docker-compose.yml build --no-cache
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Build completed successfully!"
    } else {
        Write-Error "Build failed!"
        exit 1
    }
}

# Start development environment
function Start-Environment {
    Write-Status "Starting development environment..."
    docker-compose -f docker-compose.yml up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Development environment started!"
        Write-Status "Application will be available at: http://localhost:3000"
        Write-Status "Database will be available at: localhost:5432"
        Write-Status "Redis will be available at: localhost:6379"
    } else {
        Write-Error "Failed to start development environment!"
        exit 1
    }
}

# Stop development environment
function Stop-Environment {
    Write-Status "Stopping development environment..."
    docker-compose -f docker-compose.yml down
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Development environment stopped!"
    }
}

# Restart development environment
function Restart-Environment {
    Write-Status "Restarting development environment..."
    Stop-Environment
    Start-Environment
}

# View logs
function Show-Logs {
    param([string]$ServiceName)
    
    if ($ServiceName) {
        docker-compose -f docker-compose.yml logs -f $ServiceName
    } else {
        docker-compose -f docker-compose.yml logs -f
    }
}

# Clean up Docker resources
function Clean-Docker {
    $response = Read-Host "This will remove all containers, images, and volumes. Are you sure? (y/N)"
    if ($response -match "^[yY]") {
        Write-Status "Cleaning up Docker resources..."
        docker-compose -f docker-compose.yml down -v --rmi all
        docker system prune -f
        Write-Status "Cleanup completed!"
    } else {
        Write-Status "Cleanup cancelled."
    }
}

# Run database migrations
function Run-Migrations {
    Write-Status "Running database migrations..."
    docker-compose -f docker-compose.yml exec app npm run db:push
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Migrations completed!"
    } else {
        Write-Error "Migrations failed!"
    }
}

# Open database shell
function Open-DatabaseShell {
    Write-Status "Opening database shell..."
    docker-compose -f docker-compose.yml exec postgres psql -U postgres -d expense_tracker
}

# Show help
function Show-Help {
    Write-Host "Docker Development Environment Management (PowerShell)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\scripts\docker-dev.ps1 [COMMAND] [OPTIONS]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  build     Build development Docker images"
    Write-Host "  start     Start development environment"
    Write-Host "  stop      Stop development environment"
    Write-Host "  restart   Restart development environment"
    Write-Host "  logs      View logs (optionally specify service name)"
    Write-Host "  clean     Clean up all Docker resources"
    Write-Host "  migrate   Run database migrations"
    Write-Host "  db-shell  Open database shell"
    Write-Host "  help      Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\scripts\docker-dev.ps1 start"
    Write-Host "  .\scripts\docker-dev.ps1 logs app"
    Write-Host "  .\scripts\docker-dev.ps1 migrate"
}

# Main script logic
function Main {
    Test-Docker
    Initialize-Environment

    switch ($Command.ToLower()) {
        "build" {
            Build-Images
        }
        "start" {
            Start-Environment
        }
        "stop" {
            Stop-Environment
        }
        "restart" {
            Restart-Environment
        }
        "logs" {
            Show-Logs -ServiceName $Service
        }
        "clean" {
            Clean-Docker
        }
        "migrate" {
            Run-Migrations
        }
        "db-shell" {
            Open-DatabaseShell
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