from django.db import models
from api.api_models.users import User

class OperationalDetails(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role_name = models.CharField(max_length=50) 
    department = models.CharField(max_length=50)  
    reporting_manager = models.CharField(max_length=50)  
    employee_id = models.CharField(max_length=50, unique=True)  
    branch_location = models.CharField(max_length=100)  
    joining_date = models.DateField()  
    work_shift = models.CharField(max_length=50, blank=True, null=True)  
    user_status = models.CharField(max_length=50, choices=[
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Suspended', 'Suspended')
    ])  
    associated_projects = models.TextField(blank=True, null=True)  
    role_validity_start = models.DateField(blank=True, null=True)  
    role_validity_end = models.DateField(blank=True, null=True)  

