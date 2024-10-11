from api.api_models.users import User
from django.db import transaction
from api.api_models.reset_password import ResetPassword
from api.api_models.company import Compnay
from django.contrib.auth.models import Group
from django.contrib.auth.hashers import make_password
from api.exception.app_exception import *

import uuid, re

class UserService():

    email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    password_rule = r'^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$]).{8,}$'

    def GetUsers(self, user_id):
        user_ = User.objects.get(id=user_id)
        role_id = user_.groups.values_list('id', flat=True).first()
        hr = Group.objects.get(name="HR")
        manager = Group.objects.get(name="Manager")
        user = Group.objects.get(name="User")

        if role_id == hr.id:
            ids = Group.objects.filter(name='Admin').values_list('id', flat=True)
            users = User.objects.filter(groups__id__in=ids)
            return users
        elif role_id == manager.id:
            ids = Group.objects.filter(name='Manager').values_list('id', flat=True)
            users = User.objects.filter(groups__id__in=ids)
            return users
        elif role_id == user.id:
            ids = Group.objects.filter(name='User').values_list('id', flat=True)
            users = User.objects.filter(groups__id__in=ids)
            return users

    @transaction.atomic()
    def createAdmin(self, **kwargs):
        if Compnay.objects.filter(name=kwargs.get('company')):
            raise CompanyExistException
        company = Compnay.objects.create(name=kwargs.get('company'))
        company.save()
        user = User()
        user.email = kwargs.get('email')
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.company = company
        user.password = make_password(kwargs.get('password'))
        self._validateUserCreation(user)
        user.save()
        reset_token = uuid.uuid1().hex
        ResetPassword.objects.create(
            user_id = user.id,
            reset_token = reset_token
        )
        
        role = Group.objects.get(name='Admin')
        user.groups.clear()
        user.groups.add(role)
        return user

    def createUser(self, user_id, **kwargs):
        company = User.objects.get(id=user_id).company
        user = User()
        user.email = kwargs.get('email')
        user.first_name = kwargs.get('first_name')
        user.last_name = kwargs.get('last_name')
        user.phone_number = kwargs.get('phone_number')
        user.is_active = True
        user.company = company
        user.is_staff = True
        user.is_superuser = True
        user.password = make_password(kwargs.get('password'))
        self._validateUserCreation(user)
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
        if not re.fullmatch(self.email_regex, user.email):
            raise ValidationException(f"Invalid email id {user.email}")
        
        existing_user = User.objects.filter(email=user.email).first()
        if existing_user:
            raise UserNameConflict(f"{user.email}")
