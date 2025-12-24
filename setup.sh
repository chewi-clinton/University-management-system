#!/bin/bash

# University ERP System Setup Script
# This script helps set up the University Management System

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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check if required commands are installed
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed. Please install $1 first."
        exit 1
    fi
}

# Check prerequisites
print_status "Checking prerequisites..."
check_command python3
check_command pip3
check_command git

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
REQUIRED_VERSION="3.8"

if [[ $(echo -e "$REQUIRED_VERSION\n$PYTHON_VERSION" | sort -V | head -n1) != "$REQUIRED_VERSION" ]]; then
    print_error "Python $REQUIRED_VERSION or higher is required. Current version: $PYTHON_VERSION"
    exit 1
fi

print_status "Python version: $PYTHON_VERSION ✓"

# Create virtual environment
print_status "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip

# Install requirements
print_status "Installing requirements..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env <<'ENV'
SECRET_KEY=django-insecure-change-this-in-production-$(openssl rand -base64 32)
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=university_erp_db
DB_USER=postgres
DB_PASSWORD=clintonac237
DB_HOST=localhost
DB_PORT=5432

TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here

JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

ZOOM_API_KEY=
ZOOM_API_SECRET=
ZOOM_ACCOUNT_ID=

QR_ENCRYPTION_KEY=change-this-to-32-characters-key

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_PROJECT_ID=
ENV
    print_warning "Please edit .env file with your configuration"
else
    print_status ".env file already exists"
fi

# Check if PostgreSQL is running
print_status "Checking PostgreSQL..."
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    print_warning "PostgreSQL is not running. Please start PostgreSQL and create the database."
    print_warning "Database name should match DB_NAME in .env file"
else
    print_status "PostgreSQL is running ✓"
fi

# Check if Redis is running
print_status "Checking Redis..."
if ! redis-cli ping &> /dev/null; then
    print_warning "Redis is not running. Please start Redis server."
else
    print_status "Redis is running ✓"
fi

# Run migrations
print_status "Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser if it doesn't exist
print_status "Creating superuser..."
python manage.py shell <<PYTHON
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='yxng@university.cm').exists():
    User.objects.create_superuser(
        email='yxng@university.cm',
        first_name='Admin',
        last_name='User',
        password='clintonac237',
        role='super_admin'
    )
    print('Superuser created successfully')
else:
    print('Superuser already exists')
PYTHON

# Collect static files
print_status "Collecting static files..."
python manage.py collectstatic --noinput

# Create directories
print_status "Creating necessary directories..."
mkdir -p media logs static

# Set permissions
print_status "Setting permissions..."
chmod +x manage.py

# Create systemd service files (optional)
if command -v systemctl &> /dev/null; then
    print_status "Creating systemd service files..."
    
    # Create gunicorn service
    sudo tee /etc/systemd/system/university-erp.service > /dev/null <<EOF
[Unit]
Description=University ERP Gunicorn Daemon
After=network.target

[Service]
User=$USER
Group=www-data
WorkingDirectory=$PWD
Environment="PATH=$PWD/venv/bin"
EnvironmentFile=$PWD/.env
ExecStart=$PWD/venv/bin/gunicorn --access-logfile - --workers 3 --bind unix:$PWD/gunicorn.sock university_erp.wsgi:application
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

    # Create celery service
    sudo tee /etc/systemd/system/university-erp-celery.service > /dev/null <<EOF
[Unit]
Description=Celery Worker for University ERP
After=network.target

[Service]
Type=forking
User=$USER
Group=www-data
WorkingDirectory=$PWD
Environment="PATH=$PWD/venv/bin"
EnvironmentFile=$PWD/.env
ExecStart=$PWD/venv/bin/celery -A university_erp worker -l info --detach --pidfile=$PWD/celery.pid --logfile=$PWD/logs/celery.log
ExecStop=$PWD/venv/bin/celery -A university_erp control shutdown --pidfile=$PWD/celery.pid
Restart=always

[Install]
WantedBy=multi-user.target
EOF

    # Create celery beat service
    sudo tee /etc/systemd/system/university-erp-celery-beat.service > /dev/null <<EOF
[Unit]
Description=Celery Beat for University ERP
After=network.target

[Service]
Type=simple
User=$USER
Group=www-data
WorkingDirectory=$PWD
Environment="PATH=$PWD/venv/bin"
EnvironmentFile=$PWD/.env
ExecStart=$PWD/venv/bin/celery -A university_erp beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
Restart=always

[Install]
WantedBy=multi-user.target
EOF

    print_status "Systemd service files created. Enable with:"
    print_status "sudo systemctl enable university-erp university-erp-celery university-erp-celery-beat"
    print_status "sudo systemctl start university-erp university-erp-celery university-erp-celery-beat"
fi

# Create nginx configuration (optional)
if command -v nginx &> /dev/null; then
    print_status "Creating nginx configuration..."
    
    sudo tee /etc/nginx/sites-available/university-erp > /dev/null <<EOF
server {
    listen 80;
    server_name localhost;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root $PWD;
    }

    location /media/ {
        root $PWD;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:$PWD/gunicorn.sock;
    }
}
EOF

    print_status "Nginx configuration created. Enable with:"
    print_status "sudo ln -s /etc/nginx/sites-available/university-erp /etc/nginx/sites-enabled/"
    print_status "sudo nginx -t && sudo systemctl restart nginx"
fi

# Create startup script
print_status "Creating startup script..."
cat > start.sh <<'EOF'
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
EOF

chmod +x start.sh

# Create stop script
print_status "Creating stop script..."
cat > stop.sh <<'EOF'
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
EOF

chmod +x stop.sh

# Create requirements-dev.txt for development
print_status "Creating development requirements..."
cat > requirements-dev.txt <<EOF
-r requirements.txt
django-debug-toolbar==4.2.0
django-extensions==3.2.3
pytest==7.4.0
pytest-django==4.5.2
pytest-cov==4.1.0
black==23.7.0
flake8==6.0.0
isort==5.12.0
pre-commit==3.4.0
EOF

# Create development settings
print_status "Creating development settings..."
cat > university_erp/settings_dev.py <<'EOF'
from .settings import *

# Development settings
DEBUG = True
ALLOWED_HOSTS = ['*']

# Django Debug Toolbar
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    DEBUG_TOOLBAR_CONFIG = {
        'SHOW_TOOLBAR_CALLBACK': lambda request: True,
    }

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Log to console in development
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
        'academic': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
EOF

# Create production settings template
print_status "Creating production settings template..."
cat > university_erp/settings_prod.py.template <<'EOF'
from .settings import *

# Production settings
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com', 'www.your-domain.com']

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Email settings for production
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'

# Logging for production
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/university_erp/university_erp.log',
            'maxBytes': 1024*1024*15,  # 15MB
            'backupCount': 10,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': False,
        },
        'academic': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
EOF

# Create backup script
print_status "Creating backup script..."
cat > backup.sh <<'EOF'
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
EOF

chmod +x backup.sh

# Create restore script
print_status "Creating restore script..."
cat > restore.sh <<'EOF'
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
EOF

chmod +x restore.sh

# Create monitoring script
print_status "Creating monitoring script..."
cat > monitor.sh <<'EOF'
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
EOF

chmod +x monitor.sh

# Create update script
print_status "Creating update script..."
cat > update.sh <<'EOF'
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
EOF

chmod +x update.sh

# Create comprehensive help
print_status "Creating help documentation..."
cat > HELP.md <<'EOF'
# University ERP System - Help Documentation

## Quick Start

1. **First Time Setup**:
   ```bash
   bash setup.sh
   ```

2. **Start the System**:
   ```bash
   bash start.sh
   ```

3. **Stop the System**:
   ```bash
   bash stop.sh
   ```

## Available Scripts

### setup.sh
Initial setup script that:
- Checks prerequisites
- Creates virtual environment
- Installs dependencies
- Creates configuration files
- Sets up systemd services (optional)
- Creates backup/restore scripts

### start.sh
Starts all services:
- Runs database migrations
- Starts Celery worker
- Starts Celery beat
- Starts Django development server

### stop.sh
Stops all services:
- Stops Celery worker
- Stops Celery beat
- Stops Django development server

### monitor.sh
Monitors system health:
- System resources (CPU, Memory, Disk)
- PostgreSQL status
- Redis status
- Django server status
- Celery worker status
- Celery beat status
- Log file sizes
- Database size

### backup.sh
Creates a full system backup:
- Database dump
- Media files
- Static files
- Environment file
- Backup metadata

### restore.sh
Restores system from backup:
- Restores database
- Restores media files
- Restores static files
- Restores environment file

### update.sh
Updates the system:
- Pulls latest changes from git
- Updates requirements
- Runs migrations
- Collects static files
- Restarts services

## Common Tasks

### Creating a New User
```bash
python manage.py createsuperuser
```

### Running Tests
```bash
python manage.py test
```

### Generating Test Coverage Report
```bash
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Accessing Django Admin
1. Start the server: `bash start.sh`
2. Open browser: http://localhost:8000/admin/
3. Login with superuser credentials:
   - Email: yxng@university.cm
   - Password: clintonac237

### API Documentation
- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/

### Database Management
```bash
# Create database backup
PGPASSWORD=clintonac237 pg_dump -h localhost -p 5432 -U postgres -d university_erp_db > backup.sql

# Restore database
PGPASSWORD=clintonac237 psql -h localhost -p 5432 -U postgres -d university_erp_db < backup.sql

# Reset database
python manage.py flush
python manage.py migrate
```

### Redis Management
```bash
# Start Redis
redis-server

# Connect to Redis
redis-cli

# Monitor Redis
redis-cli monitor
```

### Celery Management
```bash
# Start Celery worker
celery -A university_erp worker -l info

# Start Celery beat
celery -A university_erp beat -l info

# Stop Celery
pkill -f "celery -A university_erp"
```

## Troubleshooting

### Database Connection Issues
1. Check if PostgreSQL is running: `pg_isready -h localhost -p 5432`
2. Check database credentials in .env
3. Check if database exists: `psql -l`

### Redis Connection Issues
1. Check if Redis is running: `redis-cli ping`
2. Check Redis configuration in .env
3. Check if Redis port is accessible: `telnet localhost 6379`

### Django Server Issues
1. Check if port 8000 is already in use: `lsof -i :8000`
2. Check Django logs: `tail -f university_erp.log`
3. Check for migration issues: `python manage.py showmigrations`

### Celery Issues
1. Check Celery logs: `tail -f logs/celery.log`
2. Check if Redis is running
3. Check Celery configuration in settings.py

### Permission Issues
1. Check file permissions: `ls -la`
2. Fix permissions: `chmod +x manage.py`
3. Check user permissions for PostgreSQL and Redis

## Configuration

### Environment Variables
Edit `.env` file to configure:
- Database settings
- Redis settings
- API keys (Zoom, Google, Telegram)
- Security settings
- Logging settings

### Django Settings
- `settings.py`: Main settings
- `settings_dev.py`: Development settings
- `settings_prod.py.template`: Production settings template

### External Services
Configure external services:
- Zoom API: https://marketplace.zoom.us/
- Google Calendar API: https://console.cloud.google.com/
- Telegram Bot API: https://core.telegram.org/bots/api

## Security

### Production Checklist
1. Set DEBUG=False
2. Use strong SECRET_KEY
3. Configure ALLOWED_HOSTS
4. Enable HTTPS
5. Use secure headers
6. Configure firewall
7. Regular security updates
8. Backup strategy

### Security Headers
```python
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

## Performance

### Optimization Tips
1. Use database indexing
2. Implement caching
3. Optimize queries
4. Use connection pooling
5. Enable compression
6. Use CDN for static files
7. Monitor performance metrics

### Scaling
1. Use multiple workers
2. Implement load balancing
3. Use database replication
4. Implement horizontal scaling
5. Use microservices architecture

## Support

For additional help:
1. Check the README.md file
2. Review the API documentation
3. Check the logs for errors
4. Contact the development team
EOF

# Final message
print_status "Setup completed successfully!"
print_status ""
print_status "Next steps:"
print_status "1. Edit .env file with your Telegram Bot Token"
print_status "2. Start PostgreSQL and Redis"
print_status "3. Run: bash start.sh"
print_status "4. Access the application at: http://localhost:8000"
print_status ""
print_status "Default superuser credentials:"
print_status "Email: yxng@university.cm"
print_status "Password: clintonac237"
print_status ""
print_status "For more information, see HELP.md"
print_status ""
print_status "To get started quickly:"
print_status "1. bash setup.sh"
print_status "2. Edit .env file with your Telegram token"
print_status "3. bash start.sh"
print_status ""
print_status "Happy coding! 🚀"