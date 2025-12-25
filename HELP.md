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
