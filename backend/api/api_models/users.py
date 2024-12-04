from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.contrib.auth.models import Group
from api.api_models.company import Company
from api.api_models.custom_group import CustomGroup

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=100, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    profile_picture_filepath = models.CharField(max_length=300,  null=True, blank=True)
    profile_picture_filetype = models.CharField(max_length=100,  null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        permissions = settings.PERMISSIONS

from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    group_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number','group_name', 'is_active')
    
    def get_group_name(self, obj):
        group = obj.groups.first()
        return group.name if group else None

class GroupSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=150, allow_null=False)

    class Meta:
        model = Group
        fields = ('id', 'name')

class PermissionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    permission = serializers.CharField(max_length=255)

class RoleSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']

    def get_permissions(self, obj):
        return obj.permissions.values_list('id', 'codename')

