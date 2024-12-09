from django.db import transaction
from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth.models import Permission, Group
from django.contrib.auth.hashers import make_password

from api.api_models.users import User
from api.api_models.custom_group import CustomGroup

class Command(BaseCommand):
    def handle(self, *args, **options):
        with transaction.atomic():
            # Create groups if not already created
            for role in settings.ROLES:
                Group.objects.get_or_create(name=role)

            # Assign permissions to groups
            for role_permission in settings.ROLE_PERMISSION:
                role_name = role_permission['role']
                permissions = role_permission['permissions']
                try:
                    group = Group.objects.get(name=role_name)
                except Group.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"Group '{role_name}' does not exist"))
                    continue

                db_permissions_results = Permission.objects.filter(codename__in=permissions)
                group.permissions.set(db_permissions_results)

            # Create SuperAdmin if no users exist
            if not User.objects.exists():
                if not User.objects.filter(email="superadmin@jivass.com").exists():
                    print("SuperAdmin creation")
                    user = User.objects.create(
                        email="superadmin@jivass.com",
                        password=make_password("Jivass@123"),
                        first_name="SuperAdmin",
                        last_name="",
                        phone_number="7780376922",
                        is_active=True,
                        is_staff=True,
                        is_superuser=True
                    )
                    superadmin_group = Group.objects.get(name="SuperAdmin")
                    user.groups.add(superadmin_group)
                else:
                    print("SuperAdmin already exists")
