import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')

DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'academic',
    'unfold',
    'unfold.contrib.filters',
    'unfold.contrib.forms',
    'unfold.contrib.import_export',
    'unfold.contrib.guardian',
    'unfold.contrib.simple_history',
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'django_filters',
    'drf_yasg',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# CSRF Configuration
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CSRF_COOKIE_SECURE = False  # Set to True in production with HTTPS
CSRF_COOKIE_HTTPONLY = False

ROOT_URLCONF = 'university_erp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'university_erp.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'university_db'),
        'USER': os.getenv('DB_USER', 'yxngac'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'academic.User'

# Django REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    # Don't set DEFAULT_PERMISSION_CLASSES - let views control their own permissions
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
    ],
}

# JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(os.getenv('JWT_ACCESS_TOKEN_LIFETIME', 60))),
    'REFRESH_TOKEN_LIFETIME': timedelta(minutes=int(os.getenv('JWT_REFRESH_TOKEN_LIFETIME', 1440))),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

# Celery Configuration
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE

# Zoom API Configuration
ZOOM_API_KEY = os.getenv('ZOOM_API_KEY', '')
ZOOM_API_SECRET = os.getenv('ZOOM_API_SECRET', '')
ZOOM_ACCOUNT_ID = os.getenv('ZOOM_ACCOUNT_ID', '')

# QR Code Configuration
QR_ENCRYPTION_KEY = os.getenv('QR_ENCRYPTION_KEY', 'default-qr-encryption-key-32-chars-long')

# Google API Configuration
GOOGLE_PROJECT_ID = os.getenv('GOOGLE_PROJECT_ID')
GOOGLE_PRIVATE_KEY_ID = os.getenv('GOOGLE_PRIVATE_KEY_ID')
GOOGLE_PRIVATE_KEY = os.getenv('GOOGLE_PRIVATE_KEY')
GOOGLE_CLIENT_EMAIL = os.getenv('GOOGLE_CLIENT_EMAIL')
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CREDENTIALS_FILE = os.getenv('GOOGLE_CREDENTIALS_FILE')
GOOGLE_DELEGATED_EMAIL = os.getenv('GOOGLE_DELEGATED_EMAIL')

# Unfold Admin Configuration
UNFOLD = {
    "SITE_TITLE": "University ERP",
    "SITE_HEADER": "University Management System",
    "SITE_URL": "/",
    "SITE_ICON": {
        "light": lambda request: "/static/icon-light.svg",
        "dark": lambda request: "/static/icon-dark.svg",
    },
    "SITE_SYMBOL": "school",
    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": True,
    "ENVIRONMENT": "academic.utils.environment_callback",
    "DASHBOARD_CALLBACK": "academic.utils.dashboard_callback",
    "COLORS": {
        "primary": {
            "50": "239 246 255",
            "100": "219 234 254",
            "200": "191 219 254",
            "300": "147 197 253",
            "400": "96 165 250",
            "500": "59 130 246",
            "600": "37 99 235",
            "700": "29 78 216",
            "800": "30 64 175",
            "900": "30 58 138",
            "950": "23 37 84",
        },
    },
    "EXTENSIONS": {
        "modeltranslation": {
            "flags": {
                "en": "🇬🇧",
                "fr": "🇫🇷",
                "nl": "🇧🇪",
            },
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        "navigation": [
            {
                "title": "Dashboard",
                "separator": False,
                "items": [
                    {
                        "title": "Dashboard",
                        "icon": "dashboard",
                        "link": "/admin/",
                    },
                ],
            },
            {
                "title": "User Management",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Users",
                        "icon": "people",
                        "link": "/admin/academic/user/",
                    },
                    {
                        "title": "Students",
                        "icon": "school",
                        "link": "/admin/academic/student/",
                    },
                    {
                        "title": "Faculty Members",
                        "icon": "person",
                        "link": "/admin/academic/facultymember/",
                    },
                    {
                        "title": "Admins",
                        "icon": "admin_panel_settings",
                        "link": "/admin/academic/academicadmin/",
                    },
                ],
            },
            {
                "title": "Academic Structure",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Faculties",
                        "icon": "business",
                        "link": "/admin/academic/faculty/",
                    },
                    {
                        "title": "Departments",
                        "icon": "apartment",
                        "link": "/admin/academic/department/",
                    },
                    {
                        "title": "Programs",
                        "icon": "military_tech",
                        "link": "/admin/academic/program/",
                    },
                    {
                        "title": "Courses",
                        "icon": "book",
                        "link": "/admin/academic/course/",
                    },
                    {
                        "title": "Course Prerequisites",
                        "icon": "link",
                        "link": "/admin/academic/courseprerequisite/",
                    },
                ],
            },
            {
                "title": "Academic Calendar",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Sessions",
                        "icon": "calendar_today",
                        "link": "/admin/academic/academicsession/",
                    },
                    {
                        "title": "Semesters",
                        "icon": "event",
                        "link": "/admin/academic/semester/",
                    },
                ],
            },
            {
                "title": "Enrollment & Registration",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Enrollments",
                        "icon": "how_to_reg",
                        "link": "/admin/academic/enrollment/",
                    },
                    {
                        "title": "Course Offerings",
                        "icon": "class",
                        "link": "/admin/academic/courseoffering/",
                    },
                    {
                        "title": "Course Registrations",
                        "icon": "assignment",
                        "link": "/admin/academic/studentcourseregistration/",
                    },
                ],
            },
            {
                "title": "Attendance",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Attendance Records",
                        "icon": "fact_check",
                        "link": "/admin/academic/attendance/",
                    },
                    {
                        "title": "Attendance Summary",
                        "icon": "summarize",
                        "link": "/admin/academic/attendancesummary/",
                    },
                ],
            },
            {
                "title": "Grades & Exams",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Grades",
                        "icon": "grade",
                        "link": "/admin/academic/grade/",
                    },
                    {
                        "title": "Examinations",
                        "icon": "quiz",
                        "link": "/admin/academic/examination/",
                    },
                    {
                        "title": "Exam Rooms",
                        "icon": "meeting_room",
                        "link": "/admin/academic/examroom/",
                    },
                    {
                        "title": "Exam Schedules",
                        "icon": "schedule",
                        "link": "/admin/academic/examschedule/",
                    },
                    {
                        "title": "Admit Cards",
                        "icon": "badge",
                        "link": "/admin/academic/admitcard/",
                    },
                ],
            },
            {
                "title": "Virtual Learning",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Zoom Classes",
                        "icon": "video_call",
                        "link": "/admin/academic/zoomclass/",
                    },
                    {
                        "title": "Study Materials",
                        "icon": "folder",
                        "link": "/admin/academic/studymaterial/",
                    },
                ],
            },
            {
                "title": "Results & Transcripts",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Result Publications",
                        "icon": "publish",
                        "link": "/admin/academic/resultpublication/",
                    },
                    {
                        "title": "Transcripts",
                        "icon": "description",
                        "link": "/admin/academic/transcript/",
                    },
                ],
            },
            {
                "title": "Communications",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Notices",
                        "icon": "notifications",
                        "link": "/admin/academic/notice/",
                    },
                ],
            },
            {
                "title": "Admissions",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Admission Inquiries",
                        "icon": "contact_mail",
                        "link": "/admin/academic/admissioninquiry/",
                    },
                    {
                        "title": "Applicants",
                        "icon": "person_add",
                        "link": "/admin/academic/applicant/",
                    },
                ],
            },
        ],
    },
}

# Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'academic': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.server': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
APPEND_SLASH = True  # This is usually the default