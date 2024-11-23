from django.db import models
from .users import User

class Notification(models.Model):
    title = models.CharField(max_length=200,null=True)
    datetime = models.DateTimeField(null=True)
    event = models.CharField(max_length=200,null=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    message = models.TextField(null=True)
    read = models.BooleanField(default=False)
    deactive = models.BooleanField(default=False)

from rest_framework import serializers

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id','title','datetime','event','user','message','read','deactive')
    