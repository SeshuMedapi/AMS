from api.api_models.punch_in_out import PunchInOut
from django.utils import timezone
from rest_framework.exceptions import ValidationError

def punch_in(user):
    today = timezone.now().date()

    if PunchInOut.objects.filter(user=user, date=today, punch_in_time__isnull=False).exists():
        raise ValidationError("You have already punched in for today.")
    
    punch = PunchInOut.objects.create(user=user, date=today, punch_in_time=timezone.now())
    return punch

def punch_out(user):
    today = timezone.now().date()

    punch = PunchInOut.objects.filter(user=user, date=today, punch_out_time__isnull=True).first()

    if not punch:
        raise ValidationError("You have not punched in or already punched out.")

    punch.punch_out_time = timezone.now()
    punch.save()
    return punch
