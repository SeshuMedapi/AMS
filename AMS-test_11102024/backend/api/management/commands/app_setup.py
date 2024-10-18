from django.db import transaction
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.contrib.auth.models import Permission, Group
from django.contrib.auth.hashers import make_password
import uuid

from api.api_models.users import User
from api.api_models.reset_password import ResetPassword

class Command(BaseCommand):
    def handle(self, *args, **options):
        with transaction.atomic():
            for role in settings.ROLES:
                if not Group.objects.filter(name=role):
                    Group.objects.create(name=role)
            for role_permission in settings.ROLE_PERMISSION:
                role_name = role_permission['role']
                permissions = role_permission['permissions']
                group = Group.objects.get(name = role_name)
                db_permissions_results = Permission.objects.filter(codename__in = permissions)
                group.permissions.clear()
                for permission in db_permissions_results:
                    group.permissions.add(permission)
                    group.save()
        users = User.objects.all()
        if not users or len(users) == 0:
            print("SuperAdmin creation")
            user = User()
            user.email = "arunsingh@jivass.com"
            user.password = make_password("Jivass@123")
            user.first_name = "arunsingh"
            user.last_name = "G"
            user.phone_number = "99009900"
            user.is_active = True
            user.is_staff = True
            user.is_superuser = True
            user.save()
            # reset_token = uuid.uuid1().hex
            # ResetPassword.objects.create(
            #     user_id = user.id,
            #     reset_token = reset_token
            # )
            user.groups.add(Group.objects.get(name = "SuperAdmin"))