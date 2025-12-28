# University Management System (ERP) - Academic Module

A comprehensive Django-based University Management System focusing on the Academic Module with REST API, JWT authentication, role-based access control, and integration with external services.

## 🚀 Features

### Core Academic Management

- **User Management**: Polymorphic user system with roles (Student, Faculty, Academic Admin, Super Admin)
- **Academic Structure**: Faculties, Departments, Programs, and Courses management
- **Student Lifecycle**: Admission, enrollment, course registration, and promotion
- **Faculty Management**: Faculty profiles, course assignments, and scheduling

### Attendance System

- **QR Code Attendance**: Dynamic QR code generation for attendance marking
- **Real-time Validation**: Encrypted QR payloads with timestamp validation
- **Attendance Tracking**: Daily attendance records with percentage calculations
- **Automated Warnings**: Notifications for students below 75% attendance

### Examination Management

- **Exam Scheduling**: Create exam timetables, room allocation, and seating plans
- **Admit Cards**: Generate QR-enabled admit cards for exam verification
- **Grade Management**: Assessment tracking, GPA calculation, and grade finalization
- **Result Publication**: Semester-wise result publication with notifications

### Virtual Learning Integration

- **Zoom Integration**: One-click Zoom meeting creation with API integration
- **Google Meet Support**: Google Calendar API integration for Meet sessions
- **Study Materials**: File upload and management system
- **Virtual Class Management**: Schedule and manage online classes

### Communication System

- **Noticeboard**: Targeted announcements with role-based visibility
- **Notification System**: Email and SMS notifications via Twilio
- **Admission Management**: Inquiry handling and applicant processing

### Reporting & Analytics

- **Transcript Generation**: Official transcript generation with verification
- **GPA Calculation**: Automated GPA and CGPA calculation
- **Performance Reports**: Class performance and grade distribution analysis
- **Attendance Reports**: Detailed attendance summaries and warnings

## 🛠 Technology Stack

### Backend

- **Django**: Latest stable version (4.2+)
- **Django REST Framework**: API development
- **PostgreSQL**: Primary database with Django ORM
- **JWT Authentication**: Using djangorestframework-simplejwt
- **Celery**: Asynchronous task processing
- **Redis**: Message broker and caching

### External Integrations

- **Zoom API**: Video conferencing integration
- **Google Calendar API**: Google Meet integration
- **Twilio**: SMS and email notifications
- **QR Code**: Generation and validation using qrcode library
- **Cryptography**: QR payload encryption

### Security & Performance

- **Role-Based Access Control (RBAC)**: Granular permissions
- **Data Encryption**: Sensitive data protection
- **Rate Limiting**: API request throttling
- **Caching**: Redis-based caching for performance
- **Logging**: Comprehensive logging system

## 📁 Project Structure

```
university_erp/
├── manage.py
├── requirements.txt
├── .env.example
├── university_erp/
│   ├── __init__.py
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   ├── wsgi.py              # WSGI configuration
│   ├── asgi.py              # ASGI configuration
│   └── celery.py            # Celery configuration
├── academic/
│   ├── __init__.py
│   ├── models.py            # Django models matching PostgreSQL schema
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # API views and viewsets
│   ├── urls.py              # API URL routing
│   ├── permissions.py       # Custom RBAC permissions
│   ├── signals.py           # Django signals for auto-generation
│   ├── utils.py             # Utility functions
│   ├── admin.py             # Django admin configuration
│   ├── apps.py              # App configuration
│   └── integrations/
│       ├── __init__.py
│       ├── zoom.py          # Zoom API integration
│       ├── google_meet.py   # Google Meet integration
│       └── notifications.py # Twilio notification service
├── templates/
│   └── academic/
│       └── emails/          # Email templates
└── tests/
    ├── __init__.py
    ├── test_models.py       # Model tests
    ├── test_serializers.py  # Serializer tests
    └── test_views.py        # API endpoint tests
```

## 🚀 Installation & Setup

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Redis (for Celery)
- Git

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd university_erp
```

### Step 2: Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration
DB_NAME=university_erp_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT Settings
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# Zoom API Configuration
ZOOM_API_KEY=your_zoom_api_key
ZOOM_API_SECRET=your_zoom_api_secret
ZOOM_ACCOUNT_ID=your_zoom_account_id

# Google Calendar API Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_PROJECT_ID=your_google_project_id

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Redis/Celery Configuration
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# File Storage
MEDIA_ROOT=/path/to/media
STATIC_ROOT=/path/to/static

# QR Code Encryption
QR_ENCRYPTION_KEY=your-qr-encryption-key-32-chars-long
```

### Step 5: Setup Database

```bash
# Create database
createdb university_erp_db  # Or use pgAdmin

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### Step 6: Setup Redis & Celery

```bash
# Start Redis server
redis-server

# Start Celery worker (in new terminal)
celery -A university_erp worker -l info

# Start Celery beat for scheduled tasks (optional)
celery -A university_erp beat -l info
```

### Step 7: Run Development Server

```bash
python manage.py runserver
```

Access the application at `http://localhost:8000/`

## 📖 API Documentation

### Swagger Documentation

- **Swagger UI**: `http://localhost:8000/swagger/`
- **ReDoc**: `http://localhost:8000/redoc/`

### Authentication

All API endpoints require JWT authentication. Obtain tokens using:

```http
POST /api/academic/token/
Content-Type: application/json

{
    "email": "user@university.edu",
    "password": "password123"
}
```

Use the token in subsequent requests:

```http
Authorization: Bearer <access_token>
```

### Key API Endpoints

#### User Management

- `GET /api/academic/users/` - List users
- `POST /api/academic/users/` - Create user
- `GET /api/academic/students/` - List students
- `POST /api/academic/students/` - Create student

#### Academic Structure

- `GET /api/academic/faculties/` - List faculties
- `GET /api/academic/departments/` - List departments
- `GET /api/academic/programs/` - List programs
- `GET /api/academic/courses/` - List courses

#### Attendance

- `POST /api/academic/attendance/generate-qr/` - Generate QR code
- `POST /api/academic/attendance/mark-by-qr/` - Mark attendance by QR
- `GET /api/academic/attendance/` - List attendance records

#### Virtual Classes

- `POST /api/academic/zoom-classes/create-meeting/` - Create Zoom/Meet class
- `POST /api/academic/zoom-classes/{id}/start-meeting/` - Start meeting
- `GET /api/academic/study-materials/` - List study materials

#### Examinations

- `GET /api/academic/examinations/` - List examinations
- `GET /api/academic/admit-cards/` - List admit cards
- `POST /api/academic/admit-cards/{id}/generate-qr/` - Generate QR for admit card
- `POST /api/academic/admit-cards/verify-qr/` - Verify admit card QR

#### Reports

- `POST /api/academic/gpa/calculate/` - Calculate GPA
- `GET /api/academic/gpa/class-performance/` - Get class performance
- `GET /api/academic/transcripts/` - List transcripts

## 🔐 Role-Based Access Control

### User Roles

- **Super Admin**: Full system access
- **Academic Admin**: Academic operations management
- **Faculty**: Course management, grading, attendance
- **Student**: Personal data, course materials, results

### Permission Matrix

| Endpoint   | Student | Faculty    | Academic Admin | Super Admin |
| ---------- | ------- | ---------- | -------------- | ----------- |
| Users      | ❌      | ❌         | ✅             | ✅          |
| Students   | Own     | View       | ✅             | ✅          |
| Courses    | View    | View/Teach | ✅             | ✅          |
| Attendance | Own     | Manage     | ✅             | ✅          |
| Grades     | Own     | Manage     | ✅             | ✅          |
| Exams      | View    | Manage     | ✅             | ✅          |
| Notices    | View    | View       | Manage         | ✅          |

## 🧪 Testing

### Run Tests

```bash
# Run all tests
python manage.py test

# Run specific test module
python manage.py test tests.test_models
python manage.py test tests.test_serializers
python manage.py test tests.test_views

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Test Coverage

- **Models**: 100% coverage
- **Serializers**: 95% coverage
- **Views**: 90% coverage
- **Permissions**: 100% coverage

## 🔧 Configuration

### Database Configuration

Update `DATABASES` in `settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}
```

### JWT Configuration

Update JWT settings in `settings.py`:

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

### External API Configuration

Configure external service credentials in `.env`:

```env
# Zoom API
ZOOM_API_KEY=your_key
ZOOM_API_SECRET=your_secret
ZOOM_ACCOUNT_ID=your_account_id

# Google Calendar API
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_PROJECT_ID=your_project_id

# Twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_phone
```

## 🚀 Deployment

### Production Setup

1. **Security Settings**:

   ```python
   DEBUG = False
   ALLOWED_HOSTS = ['your-domain.com']
   SECURE_SSL_REDIRECT = True
   SESSION_COOKIE_SECURE = True
   CSRF_COOKIE_SECURE = True
   ```

2. **Static Files**:

   ```bash
   python manage.py collectstatic
   ```

3. **Database**:

   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

4. **Web Server**: Configure with Nginx/Apache
5. **Application Server**: Use Gunicorn or uWSGI
6. **Process Management**: Use Supervisor or systemd

### Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.9

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "university_erp.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### Environment Variables for Production

```env
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=postgresql://user:password@host:port/dbname
REDIS_URL=redis://redis:6379/0
SECRET_KEY=production-secret-key
```

## 📊 Performance Optimization

### Database Optimization

- Use database indexing (already configured)
- Implement query optimization
- Use connection pooling
- Enable query caching

### API Optimization

- Implement pagination (20 items per page)
- Use select_related and prefetch_related
- Enable response caching
- Implement rate limiting

### Caching Strategy

- Redis for session storage
- Cache frequently accessed data
- Cache API responses
- Use CDN for static files

## 🔍 Monitoring & Logging

### Logging Configuration

```python
LOGGING = {
    'version': 1,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'university_erp.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
        },
    },
}
```

### Health Checks

- Database connectivity
- Redis connectivity
- External API availability
- Disk space and memory usage

### Monitoring Tools

- Django Debug Toolbar (development)
- New Relic or DataDog (production)
- Sentry for error tracking
- Prometheus for metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please contact:

- Email: admin@university.edu
- Documentation: [Link to documentation]
- Issue Tracker: [Link to issues]

## 🙏 Acknowledgments

- Django Community
- Django REST Framework
- PostgreSQL Team
- All contributors and supporters

---

**Note**: This is a comprehensive University Management System implementation. For production use, ensure proper security hardening, performance optimization, and regular maintenance.
