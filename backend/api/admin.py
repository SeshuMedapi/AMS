from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin
from .models import CustomGroup

# @admin.register(CustomGroup)
# class CustomGroupAdmin(GroupAdmin):
#     fieldsets = (
#         (None, {'fields': ('name', 'permissions', 'company')}),
#     )