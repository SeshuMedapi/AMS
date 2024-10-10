"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 5.1.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-5jfos#0b#06b5(z=$^hqehbie!c3zml&ju=iv+r06d^1sc_)t+'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'api',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

ROOT_URLCONF = 'backend.urls'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'api.authentication.ExpiringTokenAuthentication', 
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

TOKEN_EXPIRED_AFTER_SECONDS = 15 * 60

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD':os.getenv('DB_PASSWORD'),
        'HOST':os.getenv('DB_HOST'),
        'PORT':os.getenv('DB_PORT'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

AUTH_USER_MODEL = 'api.User'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# FORMATTERS = (
#     {
#         "verbose": {
#             "format": "{levelname} {asctime:s} {threadName} {thread:d} {module} {filename} {lineno:d} {name} {funcName} {process:d} {message}",
#             "style": "{",
#         },
#         "simple": {
#             "format": "{levelname} {asctime:s} {module} {filename} {lineno:d} {funcName} {message}",
#             "style": "{",
#         },
#     },
# )

# HANDLERS = {
#     "console_handler": {
#         "class": "logging.StreamHandler",
#         "formatter": "simple",
#     },
#     "my_handler": {
#         "class": "logging.handlers.RotatingFileHandler",
#         "filename": f"{BASE_DIR}/logs/simple.log",
#         "mode": "a",
#         "encoding": "utf-8",
#         "formatter": "simple",
#         "backupCount": 5,
#         "maxBytes": 1024 * 1024 * 5,  # 5 MB
#     },
#     "my_handler_detailed": {
#         "class": "logging.handlers.RotatingFileHandler",
#         "filename": f"{BASE_DIR}/logs/detailed.log",
#         "mode": "a",
#         "formatter": "verbose",
#         "backupCount": 5,
#         "maxBytes": 1024 * 1024 * 5,  # 5 MB
#     },
# }

# LOGGERS = (
#     {
#         "app_log": {
#             "handlers": ["console_handler", "my_handler_detailed"],
#             "level": "INFO",
#             "propagate": False,
#         },
#         "django.request": {
#             "handlers": ["my_handler"],
#             "level": "WARNING",
#             "propagate": False,
#         },
#     },
# )

# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "formatters": FORMATTERS[0],
#     "handlers": HANDLERS,
#     "loggers": LOGGERS[0],
# }

PERMISSIONS = (
                ('create_user', ''),('edit_user', ''),('activate_user', ''),('view_users', ''),
            )

ROLES = ['SuperAdmin', 
         'Admin',
         'HR',
         'Manager',
         'User'
         ]

ROLE_PERMISSION = [
    {
        "role": "SuperAdmin",
        "permissions": [
            'activate_user', 
            'view_user', 
        ]
    },
    {
        "role": "Admin",
        "permissions": [
            'view_user',
            'create_user',
            'edit_user',            
        ]
    },
        {
        "role": "HR",
        "permissions": [
            'view_user',
            'create_user',
            'edit_user',
        ]
    },
        {
        "role": "Manager",
        "permissions": [
            'view_user'
        ]
    },
        {
        "role": "User",
        "permissions": [
            'view_user'
        ]
    }
]