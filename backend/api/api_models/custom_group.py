from django.contrib.auth.models import Group
from api.api_models.company import Company
from django.db import models
from rest_framework import serializers

from django.contrib.auth.models import Permission

class CustomGroup(models.Model):
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='custom_groups',
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='custom_groups',
        null=True,
        blank=True
    )
    permissions = models.ManyToManyField(
        Permission,
        related_name='custom_groups',
        blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['group', 'company'], name='unique_group_per_company')
        ]

    def __str__(self):
        return f"{self.group.name} - {self.company.name}"

class CustomGroupSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='group.name')
    company_name = serializers.CharField(source='company.name')
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = CustomGroup
        fields = ('id', 'group_name', 'company_name', 'permissions')

    def get_permissions(self, obj):
        return obj.permissions.values_list('codename', flat=True)
