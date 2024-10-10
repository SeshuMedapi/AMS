from django.db import models

class Compnay(models.Model):
    name = models.CharField(max_length=200)