from django.db import models

class Leavetype(models.Model):
    leavetype = models.CharField(max_length=100)

from rest_framework import serializers

class LeavetypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leavetype
        fields = ('id', 'leavetype')

