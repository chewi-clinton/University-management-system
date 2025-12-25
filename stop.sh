#!/bin/bash

# University ERP System Stop Script

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Stop Celery worker
print_status "Stopping Celery worker..."
pkill -f "celery -A university_erp worker" || print_warning "Celery worker not running"

# Stop Celery beat
print_status "Stopping Celery beat..."
pkill -f "celery -A university_erp beat" || print_warning "Celery beat not running"

# Stop Django development server
print_status "Stopping Django development server..."
pkill -f "python manage.py runserver" || print_warning "Django server not running"

print_status "All services stopped"
