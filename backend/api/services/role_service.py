from django.conf import settings
from django.contrib.auth.models import Permission, Group
from ..models import CustomGroup, User
from django.db import transaction

class RoleService:
    def list_roles(self, user_id):
        company_id = User.objects.get(id=user_id).company
        cust_group = [i.group_ptr_id for i in CustomGroup.objects.filter(company=company_id)]
        print(cust_group)
        return Group.objects.prefetch_related('permissions').filter(id__in=cust_group)
    
    @transaction.atomic()
    def add_role(self, role_name, permissions, user_id):
        company_id = User.objects.get(id=user_id).company
        if not role_name or not permissions:
            raise ValueError("Role name and permissions are required.")
        print([i.name for i in Group.objects.filter(name=role_name)])
        if Group.objects.filter(name=role_name).exists():
            raise ValueError(f"The role '{role_name}' already exists.")
        cust_group = CustomGroup.objects.create(name=role_name, company=company_id)
        db_permissions_results = Permission.objects.filter(id__in=permissions)
        cust_group.permissions.clear()
        for permission in db_permissions_results:
            cust_group.permissions.add(permission)
        
        return cust_group

    @transaction.atomic
    def update_role(self, role_id, role_name, permissions):
        try:
            role = Group.objects.get(id=role_id)
        except Group.DoesNotExist:
            raise ValueError("Role not found.")

        if role_name:
            role.name = role_name
        if permissions is not None:
            db_permissions_results = Permission.objects.filter(id__in=permissions)
            role.permissions.set(db_permissions_results)
        role.save()
        return role

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
