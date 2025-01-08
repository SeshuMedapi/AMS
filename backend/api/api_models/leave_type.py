from django.db import models

class Leavetype(models.Model):
    leavetype = models.CharField(max_length=100)