from django.db import transaction
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.contrib.auth.models import Permission, Group
from django.contrib.auth.hashers import make_password

from api.api_models.users import User

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
            user.email = "swetha@jivass.com"
            user.password = make_password("Jivass@123")
            user.first_name = "swetha"
            user.last_name = "p"
            user.phone_number = "99009900"
            user.is_active = True
            user.is_staff = True
            user.is_superuser = True
            user.save()
            user.groups.add(Group.objects.get(name = "SuperAdmin"))