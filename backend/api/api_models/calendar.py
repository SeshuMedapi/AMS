from django.db import models
from api.api_models.company import Company

class CalendarEvent(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField(unique=True)
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

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = ['id', 'name', 'date', 'description', 'is_editable', 'is_holiday', 'company']
        read_only_fields = ['id', 'is_holiday', 'is_editable']

    def validate_date(self, value):
        from datetime import date
        if self.instance is None and value < date.today():
            raise serializers.ValidationError("The date cannot be in the past.")
        return value

    def validate(self, data):
        return data

