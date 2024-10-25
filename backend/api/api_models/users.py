from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.contrib.auth.models import Group
from api.api_models.company import Company

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=100, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        permissions = settings.PERMISSIONS

from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    group_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number','group_name')
    
    def get_group_name(self, obj):
        group = obj.groups.first()
        return group.name if group else None

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')