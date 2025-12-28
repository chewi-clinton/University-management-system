#!/bin/bash

# University ERP System Update Script

set -e

print_status() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Pull latest changes
print_status "Pulling latest changes..."
git pull origin main

# Activate virtual environment
source venv/bin/activate

# Update requirements
print_status "Updating requirements..."
pip install -r requirements.txt --upgrade

# Run migrations
print_status "Running migrations..."
python manage.py migrate

# Collect static files
print_status "Collecting static files..."
python manage.py collectstatic --noinput

# Restart services
print_status "Restarting services..."
bash stop.sh
bash start.sh

print_status "Update completed successfully"
