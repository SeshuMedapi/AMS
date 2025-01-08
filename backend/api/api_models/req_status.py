from django.db import models

class Reqstatus(models.Model):
    status = models.CharField(max_length=100)

from rest_framework import serializers

class ReqstatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reqstatus
        fields = ('id', 'status')