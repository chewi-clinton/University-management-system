#!/bin/bash

# University ERP System Monitoring Script

set -e

print_status() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Check system resources
print_status "Checking system resources..."
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')%"
echo "Memory Usage: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "Disk Usage: $(df -h . | awk 'NR==2 {print $3 "/" $2 " (" $5 ")"}')"

# Check PostgreSQL
print_status "Checking PostgreSQL..."
if pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "PostgreSQL: Running"
else
    echo "PostgreSQL: Not running"
fi

# Check Redis
print_status "Checking Redis..."
if redis-cli ping &> /dev/null; then
    echo "Redis: Running"
else
    echo "Redis: Not running"
fi

# Check Django server
print_status "Checking Django server..."
if pgrep -f "python manage.py runserver" &> /dev/null; then
    echo "Django server: Running"
else
    echo "Django server: Not running"
fi

# Check Celery worker
print_status "Checking Celery worker..."
if pgrep -f "celery -A university_erp worker" &> /dev/null; then
    echo "Celery worker: Running"
else
    echo "Celery worker: Not running"
fi

# Check Celery beat
print_status "Checking Celery beat..."
if pgrep -f "celery -A university_erp beat" &> /dev/null; then
    echo "Celery beat: Running"
else
    echo "Celery beat: Not running"
fi

# Check log files
print_status "Checking log files..."
if [ -f "logs/celery.log" ]; then
    echo "Celery log size: $(du -h logs/celery.log | cut -f1)"
fi

if [ -f "university_erp.log" ]; then
    echo "Application log size: $(du -h university_erp.log | cut -f1)"
fi

# Check disk space
print_status "Checking disk space..."
df -h

# Check database size
print_status "Checking database size..."
source .env
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME')) as size;"

print_status "Monitoring completed"
