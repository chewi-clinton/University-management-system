#!/bin/bash

# University ERP System Restore Script

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_directory>"
    echo "Example: $0 backups/20231001_120000"
    exit 1
fi

BACKUP_DIR="$1"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "Backup directory $BACKUP_DIR does not exist"
    exit 1
fi

# Load environment variables
source .env

print_status() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Confirm restore
read -p "Are you sure you want to restore from $BACKUP_DIR? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled"
    exit 1
fi

# Restore database
print_status "Restoring database..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME < "$BACKUP_DIR/database.sql"

# Restore media files
print_status "Restoring media files..."
tar -xzf "$BACKUP_DIR/media.tar.gz"

# Restore static files
print_status "Restoring static files..."
tar -xzf "$BACKUP_DIR/static.tar.gz"

# Restore environment file
print_status "Restoring environment file..."
cp "$BACKUP_DIR/.env" .

print_status "Restore completed successfully"
