"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 5.1.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
from string import Template
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
    'corsheaders'
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
    ],
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
        # 'OPTIONS': {
        # 'options': '-c search_path='+'public'
        # },
        'NAME': 'ams',
        'USER': 'postgres',
        'PASSWORD':'Seshu@27',
        'HOST':'localhost',
        'PORT':'',
    }
}

# SMTP_EMAIL_BACKEND = os.getenv('SMTP_EMAIL_BACKEND')
# SMTP_EMAIL_HOST = os.getenv('SMTP_EMAIL_HOST')
# SMTP_EMAIL_PORT = os.getenv('SMTP_EMAIL_PORT')
# SMTP_EMAIL_USE_TLS = os.getenv('SMTP_EMAIL_USE_TLS')
# SMTP_EMAIL_USERNAME = os.getenv('SMTP_EMAIL_USERNAME')
# SMTP_EMAIL_PASSWORD = os.getenv('SMTP_EMAIL_PASSWORD')
# DEFAULT_FROM_EMAIL = SMTP_EMAIL_USERNAME

SMTP_EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
SMTP_EMAIL_HOST = 'smtp.zoho.com'
SMTP_EMAIL_PORT = 587
SMTP_EMAIL_USE_TLS = True
SMTP_EMAIL_USERNAME = 'arunsingh@jivass.com'
SMTP_EMAIL_PASSWORD = 'TXxtbLkR0XkV'
DEFAULT_FROM_EMAIL = SMTP_EMAIL_USERNAME

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'


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

USE_TZ = False

AUTH_USER_MODEL = 'api.User'

AUTH_GROUP_MODEL = 'api.CustomGroup'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

APP_DOMAIN_BASE_URL = "http://localhost:3000"
RESET_PASSWORD_TOKEN_EXPIRE_DAYS = 3

FORMATTERS = (
    {
        "verbose": {
            "format": "{levelname} {asctime:s} {threadName} {thread:d} {module} {filename} {lineno:d} {name} {funcName} {process:d} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {asctime:s} {module} {filename} {lineno:d} {funcName} {message}",
            "style": "{",
        },
    },
)

HANDLERS = {
    "console_handler": {
        "class": "logging.StreamHandler",
        "formatter": "simple",
    },
    "my_handler": {
        "class": "logging.handlers.RotatingFileHandler",
        "filename": f"{BASE_DIR}/logs/simple.log",
        "mode": "a",
        "encoding": "utf-8",
        "formatter": "simple",
        "backupCount": 5,
        "maxBytes": 1024 * 1024 * 5,  # 5 MB
    },
    "my_handler_detailed": {
        "class": "logging.handlers.RotatingFileHandler",
        "filename": f"{BASE_DIR}/logs/detailed.log",
        "mode": "a",
        "formatter": "verbose",
        "backupCount": 5,
        "maxBytes": 1024 * 1024 * 5,  # 5 MB
    },
}

LOGGERS = (
    {
        "app_log": {
            "handlers": ["console_handler", "my_handler_detailed"],
            "level": "INFO",
            "propagate": False,
        },
        "django.request": {
            "handlers": ["my_handler"],
            "level": "WARNING",
            "propagate": False,
        },
    },
)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": FORMATTERS[0],
    "handlers": HANDLERS,
    "loggers": LOGGERS[0],
}

LEAVESTATUS = ['Pending', 'Approved', 'Rejected']

LEAVETYPE = ['Annual', 'Sick', 'Compensatory', 'Other']

PERMISSIONS = (
                ('create_company', ''), ('view_company', ''), ('delete_company', ''), ('create_user', ''), ('edit_user', ''), ('activate_user', ''), ('view_users', ''),
                ('view_calendar', ''), ('edit_calendar', ''), ('add_role', ''), ('edit_role', ''), ('activate_role',''), ('punch_in', ''), ('request_leave', ''), ('approve_leave', ''),('add_branch', ''),
            )

ROLES = ['SuperAdmin', 
         'Admin',
         'HR',
         'Manager'
         ]

ROLE_PERMISSION = [
    {
        "role": "SuperAdmin",
        "permissions": [
            'create_company',
            'view_company',
            'delete_company',
            'activate_user'
        ]
    },
    {
        "role": "Admin",
        "permissions": [
            'view_users',
            'create_user',
            'edit_user',    
            'view_calendar',
            'add_role',
            'edit_role', 
            'activate_user',
            'activate_role',
            'add_branch'    
        ]
    },
        {
        "role": "HR",
        "permissions": [
            'view_users',
            'create_user',
            'edit_user',
            'view_calendar',
            'edit_calendar',
            'activate_user',
            'punch_in',
            'approve_leave'
        ]
    },
        {
        "role": "Manager",
        "permissions": [
            'view_users',
            'create_user',
            'edit_user',
            'view_calendar',
            'activate_user',
            'punch_in',
            'request_leave',
            'approve_leave'
        ]
    },
    #     {
    #     "role": "User",
    #     "permissions": [
    #         'view_users',
    #         'view_calendar'
    #     ]
    # }
]


WELCOME_COMPANY_EMAIL=Template(
                '''
                <!DOCTYPE html>
                <html>
                <head>
                <title>WELCOME</title>
                </head>
                <body>
                    Hi $company,<br><br>
                    Welcome to the Attendance Management Portal!<br><br>
                    Your account has been successfully created, and you can start using the platform.<br><br><br>
                    <b>Login Credentials:</b><br><br>
                    Email: $email<br>
                  	Password: <a href='$password_reset_url'>Please click here to set your password<a><br><br><br>                
                    Please note that the password set link will expire in 3 days for your account’s security. After that, it will no longer be valid, and you’ll need to request a new link. If you did not request a password set, please ignore this email or contact our support team immediately at <a href="mailto:contact@jivass.com">contact@jivass.com</a>.<br><br><br>
                    Best,<br>
                    Jivass Technologies<br><br>
                    -------------------------------------------------------<br>
                    1st Floor Ashwamedha Velachery Main Rd<br> 
                    Guindy Chennai 600032<br>          
                </body>
                </html>
                '''
               )

WELCOME_EMAIL=Template(
                '''
                <!DOCTYPE html>
                <html>
                <head>
                <title>WELCOME</title>
                </head>
                <body>
                    Hi $first_name,<br><br>
                    Welcome to the Attendance Management Portal!<br><br>
                    Your account has been successfully created, and you can start using the platform.<br><br><br>
                    <b>Login Credentials:</b><br><br>
                    Username: $first_name <br>
                    Email: $email<br>
                  	Password: <a href='$password_reset_url'>Please click here to set your password<a><br><br><br>                
                    Please note that the password set link will expire in 3 days for your account’s security. After that, it will no longer be valid, and you’ll need to request a new link. If you did not request a password set, please ignore this email or contact our support team immediately at <a href="mailto:contact@jivass.com">contact@jivass.com</a>.<br><br><br>
                    Best,<br>
                    Jivass Technologies<br><br>
                    -------------------------------------------------------<br>
                    1st Floor Ashwamedha Velachery Main Rd<br> 
                    Guindy Chennai 600032<br>          
                </body>
                </html>
                '''
               )

RESET_PASSWORD=Template(
                '''
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Password Reset Request</title>
                </head>
                <body>
                    Hi $first_name,<br><br>
                    We received a request to reset the password for your Attendance Management Portal. Just click the link below to create a new password.<br><br>
                    <a href='$password_reset_url'>Reset Your Password</a><br><br>
                    Please note that the password reset link will expire in 3 days for your account’s security. After that, it will no longer be valid, and you’ll need to request a new link. If you did not request a password reset, please ignore this email or contact our support team immediately at <a href="mailto:contact@jivass.com">contact@jivass.com</a>.<br><br><br>
                    Best,<br>
                    Jivass Technologies<br><br>
                    -------------------------------------------------------<br>
                    1st Floor Ashwamedha Velachery Main Rd<br> 
                    Guindy Chennai 600032<br>
                </body>
                </html>
                '''
               )

EVENT_NOTIFICATION = Template(
                '''
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Event Notification</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 90%;
                            max-width: 600px;
                            margin: 20px auto;
                            background: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 0.9em;
                            color: #777;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Event Notification</h2>
                        <p>Hi $first_name,</p>
                        <p>We are notifying you about an upcoming event. Please find the details below:</p>
                        <ul>
                            <li><strong>Event Name:</strong> $event_name</li>
                            <li><strong>Event Date & Time:</strong> $event_datetime</li>
                            <li><strong>Event Type:</strong> $event_type</li>
                            <li><strong>Description:</strong> $description</li>
                        </ul>
                        <p>If you have any questions or need further assistance, please contact us at 
                            <a href="mailto:contact@jivass.com">contact@jivass.com</a>.
                        </p>
                        <p>Best Regards,</p>
                        <p>Jivass Technologies</p>
                        <div class="footer">
                            -------------------------------------------------------<br>
                            1st Floor Ashwamedha Velachery Main Rd<br> 
                            Guindy, Chennai 600032<br>
                        </div>
                    </div>
                </body>
                </html>
                '''
            )

EVENT_UPDATE_NOTIFICATION = Template(
    '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Event Updated</title>
    </head>
    <body>
        Hi $first_name,<br><br>
        The event "<strong>$event_name</strong>" has been updated.<br><br>
        <strong>Updated Details:</strong><br>
        - Event Date & Time: $event_datetime<br>
        - Event Type: $event_type<br>
        - Description: $description<br><br>
        If you have any questions, feel free to contact our support team at <a href="mailto:support@jivass.com">support@jivass.com</a>.<br><br>
        Best Regards,<br>
        Jivass Technologies
    </body>
    </html>
    '''
)


EVENT_DELETE_NOTIFICATION = Template(
    '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Event Deleted</title>
    </head>
    <body>
        Hi $first_name,<br><br>
        We wanted to inform you that the event "<strong>$event_name</strong>" has been deleted from the calendar.<br><br>
        If this was done in error or if you have any concerns, please reach out to our support team at <a href="mailto:support@jivass.com">support@jivass.com</a>.<br><br>
        Best Regards,<br>
        Jivass Technologies
    </body>
    </html>
    '''
)
