#!/bin/bash

# Docker development environment management script

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

# Create environment file if it doesn't exist
setup_env() {
    if [ ! -f .env.docker.local ]; then
        print_warning ".env.docker.local not found. Creating from template..."
        cp .env.docker .env.docker.local
        print_warning "Please edit .env.docker.local with your actual values before running the application."
    fi
}

# Build development images
build() {
    print_status "Building development Docker images..."
    docker-compose -f docker-compose.yml build --no-cache
    print_status "Build completed successfully!"
}

# Start development environment
start() {
    print_status "Starting development environment..."
    docker-compose -f docker-compose.yml up -d
    print_status "Development environment started!"
    print_status "Application will be available at: http://localhost:3000"
    print_status "Database will be available at: localhost:5432"
    print_status "Redis will be available at: localhost:6379"
}

# Stop development environment
stop() {
    print_status "Stopping development environment..."
    docker-compose -f docker-compose.yml down
    print_status "Development environment stopped!"
}

# Restart development environment
restart() {
    print_status "Restarting development environment..."
    stop
    start
}

# View logs
logs() {
    if [ -z "$1" ]; then
        docker-compose -f docker-compose.yml logs -f
    else
        docker-compose -f docker-compose.yml logs -f "$1"
    fi
}

# Clean up Docker resources
clean() {
    print_warning "This will remove all containers, images, and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eY][sS]|[yY])$ ]]; then
        print_status "Cleaning up Docker resources..."
        docker-compose -f docker-compose.yml down -v --rmi all
        docker system prune -f
        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Run database migrations
migrate() {
    print_status "Running database migrations..."
    docker-compose -f docker-compose.yml exec app npm run db:push
    print_status "Migrations completed!"
}

# Open database shell
db_shell() {
    print_status "Opening database shell..."
    docker-compose -f docker-compose.yml exec postgres psql -U postgres -d expense_tracker
}

# Show help
show_help() {
    echo "Docker Development Environment Management"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build     Build development Docker images"
    echo "  start     Start development environment"
    echo "  stop      Stop development environment"
    echo "  restart   Restart development environment"
    echo "  logs      View logs (optionally specify service name)"
    echo "  clean     Clean up all Docker resources"
    echo "  migrate   Run database migrations"
    echo "  db-shell  Open database shell"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs app"
    echo "  $0 migrate"
}

# Main script logic
main() {
    check_docker
    setup_env

    case "${1:-help}" in
        build)
            build
            ;;
        start)
            start
            ;;
        stop)
            stop
            ;;
        restart)
            restart
            ;;
        logs)
            logs "$2"
            ;;
        clean)
            clean
            ;;
        migrate)
            migrate
            ;;
        db-shell)
            db_shell
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