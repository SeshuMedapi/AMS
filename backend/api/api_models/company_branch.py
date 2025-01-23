from django.db import models
from .company import Company
from rest_framework.serializers import ModelSerializer

class CompanyBranch(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    branch = models.CharField(max_length=300)
    country = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    city = models.CharField(max_length=300)
    address = models.TextField()

class CompanyBranchSerializer(ModelSerializer):
    class Meta:
        model = CompanyBranch
        fields = '__all__'