from django.contrib.auth.models import User
from django.db import models
from django.conf import settings

class PunchInOut(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    punch_in_time = models.DateTimeField(null=True, blank=True)
    punch_out_time = models.DateTimeField(null=True, blank=True)
    date = models.DateField()

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"Punch record for {self.user.username} on {self.date}"