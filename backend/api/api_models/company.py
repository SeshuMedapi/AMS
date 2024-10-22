from django.db import models
from rest_framework import serializers

class Compnay(models.Model):
    name = models.CharField(max_length=200)

class AdminUserSerializer(serializers.Serializer):
    company = serializers.CharField()
    email = serializers.EmailField()