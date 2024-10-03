from api.api_models.users import User
from django.db import transaction
from api.api_models.reset_password import ResetPassword
from django.contrib.auth.models import Group
from api.exception.app_exception import *

import uuid, re

class UserService():
    def createUser(self, **kwargs):
        user = User()
        user.email = kwargs.get('email')
        user.first_name = kwargs.get('first_name')
        user.last_name = kwargs.get('last_name')
        user.phone_number = kwargs.get('phone_number')
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.password = kwargs.get('password')
        # self._validateUserCreation(user)
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
        if not user.email:
            raise ValidationException("Invalid email id")
        if not re.fullmatch(self.email_regex, user.email):
            raise ValidationException(f"Invalid email id {user.email}")
        
        existing_user = User.objects.filter(email=user.email).first()
        if existing_user:
            raise UserNameConflict(f"{user.email}")
