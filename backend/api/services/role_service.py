from django.conf import settings
from django.contrib.auth.models import Permission, Group
from ..models import CustomGroup, User
from django.db import transaction
from api.exception.app_exception import *

class RoleService:
    def list_roles(self, user_id):
        company_id = User.objects.get(id=user_id).company.id
        custom_groups = CustomGroup.objects.filter(company_id=company_id).prefetch_related('permissions')
        
        roles = []
        for custom_group in custom_groups:
            group = custom_group.group
            permissions = custom_group.permissions.values('id', 'codename', 'name')
            roles.append({
                'role_id': group.id,
                'role_name': group.name,
                'permissions': list(permissions)
            })
        
        return roles

    @transaction.atomic
    def add_role(self, role_name, permissions, user_id):
        user = User.objects.get(id=user_id)
        company = user.company

        if not role_name or not permissions:
            raise ValueError("Role name and permissions are required.")
        group = Group.objects.filter(name=role_name).first()
        if not group:
            group = Group.objects.create(name=role_name)
        if CustomGroup.objects.filter(group=group, company=company).exists():
            raise ValueError(f"The role '{role_name}' already exists for the company '{company.name}'.")
        custom_group = CustomGroup.objects.create(group=group, company=company)
        permissions_qs = Permission.objects.filter(id__in=permissions)
        print(permissions_qs, permissions)

        if len(permissions_qs) != len(permissions):
            raise ValueError("Some of the permissions provided do not exist.")
        custom_group.permissions.set(permissions_qs)

        return custom_group

    @transaction.atomic
    def update_role(self, role_id, role_name, permissions, user_company):
        try:
            custom_group = CustomGroup.objects.get(group__id=role_id, company=user_company)
        except CustomGroup.DoesNotExist:
            raise ValueError("Role not found.")

        if role_name:
            custom_group.group.name = role_name
            custom_group.group.save()

        if permissions is not None:
            permissions_qs = Permission.objects.filter(id__in=permissions)
            if len(permissions_qs) != len(permissions):
                raise ValueError("Some of the permissions provided do not exist.")
            custom_group.permissions.set(permissions_qs)

        custom_group.save()
        return custom_group

    @transaction.atomic
    def delete_role(self, role_id):
        try:
            role = Group.objects.get(id=role_id)
            role.delete()
        except Group.DoesNotExist:
            raise ValueError("Role not found.")

    def list_permissions(self):
        perm_l = []
        perm_list = []

        perm = settings.PERMISSIONS 
        for perm in perm:
            perm_l.append(perm[0])
        
        db_permissions = Permission.objects.filter(codename__in = perm_l).exclude(codename__in=['create_company', 'view_company', 'delete_company'])
        for i in db_permissions:
            perm_dict={'id' : i.id, 'permission' : i.codename}
            perm_list.append(perm_dict)
        return perm_list
    

    def activateRoleOrDeactivateRole(self, role_id, isActivate):
        user = User.objects.filter(id=role_id).first()
        if user:
            user.is_active = isActivate
            user.save()
        else:
            raise RoleNotFound