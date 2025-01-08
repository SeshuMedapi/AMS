from django.db import models

class Reqstatus(models.Model):
    status = models.CharField(max_length=100)