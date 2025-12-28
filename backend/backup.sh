#!/bin/bash

# University ERP System Backup Script

set -e

# Load environment variables
source .env

# Create backup directory
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup database
print_status() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

print_status "Backing up database..."
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > "$BACKUP_DIR/database.sql"

# Backup media files
print_status "Backing up media files..."
tar -czf "$BACKUP_DIR/media.tar.gz" media/

# Backup static files
print_status "Backing up static files..."
tar -czf "$BACKUP_DIR/static.tar.gz" static/

# Backup environment file
print_status "Backing up environment file..."
cp .env "$BACKUP_DIR/"

# Create backup info
print_status "Creating backup info..."
cat > "$BACKUP_DIR/backup_info.txt" <<INFO
Backup Date: $(date)
Database: $DB_NAME
Host: $DB_HOST
Port: $DB_PORT
Backup Type: Full
INFO

print_status "Backup completed successfully in $BACKUP_DIR"
