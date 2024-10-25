from api.api_models.users import User
from django.db import transaction
from api.api_models.reset_password import ResetPassword
from api.api_models.company import Company
from api.services.email_service import EmailService
from django.contrib.auth.models import Group
from django.contrib.auth.hashers import make_password
from api.exception.app_exception import *
from django.conf import settings
from django.db.models import F
from datetime import datetime
import uuid, re

class UserService():

    email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    password_rule = r'^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$]).{8,}$'

    def GetUsers(self, user_id):
        user_ = User.objects.get(id=user_id)
        role_id = user_.groups.values_list('id', flat=True).first()

        Admin = Group.objects.get(name="Admin")
        hr = Group.objects.get(name="HR")
        manager = Group.objects.get(name="Manager")

        admin_ids = Group.objects.filter(name__in=['HR', 'Manager', 'User']).values_list('id', flat=True)
        hr_ids = Group.objects.filter(name__in=['Manager', 'User']).values_list('id', flat=True)
        manager_ids = Group.objects.filter(name='User').values_list('id', flat=True)

        if role_id == Admin.id:
            users = User.objects.filter(groups__id__in=admin_ids).annotate(group_name=F('groups__name'))
        elif role_id == hr.id:
            users = User.objects.filter(groups__id__in=hr_ids).annotate(group_name=F('groups__name'))
        elif role_id == manager.id:
            users = User.objects.filter(groups__id__in=manager_ids).annotate(group_name=F('groups__name'))
        else:
            users = User.objects.none()

        return users

    @transaction.atomic()
    def createAdmin(self, **kwargs):
        if Company.objects.filter(name=kwargs.get('company')):
            raise CompanyExistException
        company = Company.objects.create(name=kwargs.get('company'))
        company.save()
        user = User()
        user.email = kwargs.get('email')
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.company = company
        user.password = make_password("Jivass@123")
        self._validateUserCreation(user.email)
        user.save()
        if user:
            reset_token = uuid.uuid1().hex
            ResetPassword.objects.create(
                user_id = user.id,
                reset_token = reset_token
            )
            
            role = Group.objects.get(name='Admin')
            user.groups.clear()
            user.groups.add(role)
        
            formatted_email = settings.WELCOME_COMPANY_EMAIL.substitute(
                        {"company": user.company,
                        "password_reset_url": (f"{settings.APP_DOMAIN_BASE_URL}/ResetPassword?token={reset_token}"),
                        "email": user.email
                        })
            EmailService(settings.SMTP_EMAIL_HOST, settings.SMTP_EMAIL_USERNAME, settings.SMTP_EMAIL_PASSWORD).send_smtp_email(user.email, formatted_email, "Attendance Management Portal - welcome")
            return user

    def createUser(self, user_id, **kwargs):
        print("ok")
        company = User.objects.get(id=user_id).company
        user = User()
        print("ok")
        user.email = kwargs.get('email')
        user.first_name = kwargs.get('first_name')
        user.last_name = kwargs.get('last_name')
        user.phone_number = kwargs.get('phone_number')
        user.is_active = True
        print(company)
        user.company = company
        user.is_staff = True
        user.is_superuser = True
        self._validateUserCreation(user.email)
        with transaction.atomic():
            user.save()
            reset_token = uuid.uuid1().hex
            ResetPassword.objects.create(
                user_id = user.id,
                reset_token = reset_token
            )
            role = Group.objects.get(id=kwargs.get('role_id'))
            user.groups.clear()
            user.groups.add(role)
            return user
    
    def _validateUserCreation(self, user):
        if not user:
            raise ValidationException("Invalid email id")
        if not re.fullmatch(self.email_regex, user):
            raise ValidationException(f"Invalid email id {user}")
        existing_user = User.objects.filter(email=user).first()
        
        if existing_user:
            raise UserNameConflict(f"{user}")
        
    def passwordResetRequest(self, email):
        if not email:
            return False
        
        user = User.objects.filter(email=email).first()
        if user:
            reset_token = uuid.uuid1().hex
            ResetPassword.objects.create(
                user_id = user.id,
                reset_token = reset_token
            )
            formatted_email = settings.RESET_PASSWORD.substitute(
                        {"first_name": user.first_name,
                         "last_name": user.last_name,
                         "password_reset_url": (f"{settings.APP_DOMAIN_BASE_URL}/ResetPassword?token={reset_token}")
                         })
            EmailService(settings.SMTP_EMAIL_HOST, settings.SMTP_EMAIL_USERNAME, settings.SMTP_EMAIL_PASSWORD).send_smtp_email(user.email, formatted_email, "Attendance Management Portal - Password reset request")
            return True
        else:
            return False

    def setNewPassword(self, token, new_password):
        reset_password_req = ResetPassword.objects.filter(reset_token = token).first()
        if reset_password_req:
            diff = datetime.now() - reset_password_req.date_time.replace(tzinfo=None)
            if diff.days <= settings.RESET_PASSWORD_TOKEN_EXPIRE_DAYS:
                user = User.objects.get(id=reset_password_req.user_id)
                self._check_password_policy(new_password)
                user.password = make_password(new_password)
                user.save()
                reset_password_req.delete()
            else:
                reset_password_req.delete()
                raise ResetPasswordTokenExpired
        else:
            raise InvalidResetPasswordToken

    def isTokenValid(self, token):
        reset_password_req = ResetPassword.objects.filter(reset_token = token).first()
        if reset_password_req:
            diff = datetime.now() - reset_password_req.date_time.replace(tzinfo=None)
            if diff.days <= settings.RESET_PASSWORD_TOKEN_EXPIRE_DAYS:
                return True
            else:
                raise ResetPasswordTokenExpired
        else:
            raise InvalidResetPasswordToken

    def _check_password_policy(self, password):
         if not re.fullmatch(self.password_rule, password):
            raise PasswordPolicyViolation(f"At least 8 characters <br/>"
                             f"At least one capital letter <br/>"
                             f"At least one number <br/>"
                             f"At least one special character from (@,#,$)")
