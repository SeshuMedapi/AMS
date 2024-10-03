from django.db import models
from .users import User

class ResetPassword(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    reset_token = models.CharField(max_length=100, null=False)
    date_time = models.DateTimeField(auto_now=True)