from django.db import models
from api.api_models.users import User

class PersonalDetails(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # first_name = models.CharField(max_length=50) 
    # middle_name = models.CharField(max_length=50) 
    # last_name = models.CharField(max_length=50) 
    date_of_birth = models.DateField()  
    gender = models.CharField(max_length=50, choices=[
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ])  
    # primary_contact_number = models.CharField(max_length=10)  
    # email_address = models.EmailField(unique=True)  
    emergency_contact_name = models.CharField(max_length=200)  
    emergency_contact_relationship = models.CharField(max_length=100)  
    emergency_contact_number = models.CharField(max_length=10)  
    residential_address = models.TextField()  
    nationality = models.CharField(max_length=25)  
    identity_proof_type = models.CharField(max_length=50, blank=True, null=True) 
    identity_proof_number = models.CharField(max_length=25, blank=True, null=True)  
    marital_status = models.CharField(max_length=30, blank=True, null=True)  
    # profile_picture = models.ImageField(upload_to="profile_pictures/", blank=True, null=True) 
    educational_qualifications = models.TextField(blank=True, null=True)  
    work_experience = models.TextField(blank=True, null=True)  
    certifications_skills = models.TextField(blank=True, null=True)  
    languages_known = models.CharField(max_length=200, blank=True, null=True) 
    # uploaded_files = models.FileField(upload_to="certificates/", blank=True, null=True) 