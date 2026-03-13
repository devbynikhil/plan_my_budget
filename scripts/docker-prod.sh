#!/bin/bash

# Docker production environment management script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Check if production environment file exists
check_prod_env() {
    if [ ! -f .env.production ]; then
        print_error ".env.production file not found. Please create it with production values."
        exit 1
    fi
}

# Build production images
build() {
    print_status "Building production Docker images..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    print_status "Production build completed successfully!"
}

# Deploy to production
deploy() {
    print_status "Deploying to production..."
    
    # Build images
    build
    
    # Start services
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Run health checks
    health_check
    
    print_status "Production deployment completed!"
    print_status "Application is available at your configured domain"
}

# Stop production environment
stop() {
    print_status "Stopping production environment..."
    docker-compose -f docker-compose.prod.yml down
    print_status "Production environment stopped!"
}

# Update production deployment
update() {
    print_status "Updating production deployment..."
    
    # Pull latest code (assuming this is run after git pull)
    build
    
    # Rolling update
    docker-compose -f docker-compose.prod.yml up -d --no-deps app
    
    print_status "Production update completed!"
}

# View production logs
logs() {
    if [ -z "$1" ]; then
        docker-compose -f docker-compose.prod.yml logs -f --tail=100
    else
        docker-compose -f docker-compose.prod.yml logs -f --tail=100 "$1"
    fi
}

# Health check
health_check() {
    print_status "Running health checks..."
    
    # Check application health
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_status "✓ Application is healthy"
    else
        print_error "✗ Application health check failed"
    fi
    
    # Check database health
    if docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        print_status "✓ Database is healthy"
    else
        print_error "✗ Database health check failed"
    fi
    
    # Check Redis health
    if docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
        print_status "✓ Redis is healthy"
    else
        print_error "✗ Redis health check failed"
    fi
}

# Backup database
backup() {
    print_status "Creating database backup..."
    
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    
    docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres expense_tracker > "backups/$BACKUP_FILE"
    
    print_status "Database backup created: backups/$BACKUP_FILE"
}

# Restore database from backup
restore() {
    if [ -z "$1" ]; then
        print_error "Please specify backup file: $0 restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "backups/$1" ]; then
        print_error "Backup file not found: backups/$1"
        exit 1
    fi
    
    print_warning "This will overwrite the current database. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eY][sS]|[yY])$ ]]; then
        print_status "Restoring database from backup: $1"
        docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d expense_tracker < "backups/$1"
        print_status "Database restore completed!"
    else
        print_status "Restore cancelled."
    fi
}

# Scale services
scale() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        print_error "Usage: $0 scale <service> <replicas>"
        exit 1
    fi
    
    print_status "Scaling $1 to $2 replicas..."
    docker-compose -f docker-compose.prod.yml up -d --scale "$1=$2"
    print_status "Scaling completed!"
}

# Show system status
status() {
    print_status "Production system status:"
    docker-compose -f docker-compose.prod.yml ps
    
    echo ""
    print_status "Resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

# Show help
show_help() {
    echo "Docker Production Environment Management"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build       Build production Docker images"
    echo "  deploy      Deploy to production"
    echo "  update      Update production deployment"
    echo "  stop        Stop production environment"
    echo "  logs        View logs (optionally specify service name)"
    echo "  health      Run health checks"
    echo "  backup      Create database backup"
    echo "  restore     Restore database from backup"
    echo "  scale       Scale service replicas"
    echo "  status      Show system status"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy"
    echo "  $0 logs app"
    echo "  $0 scale app 3"
    echo "  $0 backup"
}

# Create backups directory if it doesn't exist
mkdir -p backups

# Main script logic
main() {
    check_docker
    
    case "${1:-help}" in
        build)
            check_prod_env
            build
            ;;
        deploy)
            check_prod_env
            deploy
            ;;
        update)
            check_prod_env
            update
            ;;
        stop)
            stop
            ;;
        logs)
            logs "$2"
            ;;
        health)
            health_check
            ;;
        backup)
            backup
            ;;
        restore)
            restore "$2"
            ;;
        scale)
            scale "$2" "$3"
            ;;
        status)
            status
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"