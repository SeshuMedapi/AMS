from django.db import models
from rest_framework import serializers

class Company(models.Model):
    name = models.CharField(max_length=200)

class AdminUserSerializer(serializers.Serializer):
    company_id = serializers.IntegerField()
    company = serializers.CharField()
    email = serializers.EmailField()