from django.contrib.auth.models import Group
from django.db import models

class CustomGroup(Group):
    company = models.ForeignKey(
        'company', 
        null=True, 
        blank=True, 
        on_delete=models.CASCADE,
        related_name='groups'
    )

    def __str__(self):
        return self.name
