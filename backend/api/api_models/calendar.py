from django.db import models
from api.api_models.company import Company

class CalendarEvent(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateTimeField()
    type = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_editable = models.BooleanField(default=True)
    is_holiday = models.BooleanField(default=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    
    def save(self, *args, **kwargs):
        if self.date.weekday() == 6:
            self.is_holiday = True
            self.is_editable = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.date} ({'Holiday' if self.is_holiday else 'Working Day'})"
    
from rest_framework import serializers
from django.utils.timezone import now

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = ['id', 'name', 'date', 'type', 'description', 'is_editable', 'is_holiday', 'company']
        read_only_fields = ['id', 'is_holiday', 'is_editable']

    def validate_date(self, value):
        if value < now():
            raise serializers.ValidationError("The date cannot be earlier than the current date and time.")
        return value

    def validate(self, data):
        return data

