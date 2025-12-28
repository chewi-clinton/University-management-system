#!/bin/bash

# University ERP System Startup Script

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

# Activate virtual environment
source venv/bin/activate

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    print_warning "PostgreSQL is not running. Please start PostgreSQL."
    exit 1
fi

# Check if Redis is running
if ! redis-cli ping &> /dev/null; then
    print_warning "Redis is not running. Please start Redis."
    exit 1
fi

# Run migrations
print_status "Running migrations..."
python manage.py migrate

# Start Celery worker in background
print_status "Starting Celery worker..."
nohup celery -A university_erp worker -l info > logs/celery.log 2>&1 &

# Start Celery beat in background
print_status "Starting Celery beat..."
nohup celery -A university_erp beat -l info > logs/celery_beat.log 2>&1 &

# Start development server
print_status "Starting development server..."
python manage.py runserver 0.0.0.0:8000
