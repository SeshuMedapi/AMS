from django.core.exceptions import ObjectDoesNotExist
from api.api_models.users import User
from api.api_models.calendar import CalendarEvent, CalendarEventSerializer
import logging

logger = logging.getLogger("app_log")

def get_all_calendar_events(user_id):
    try:
        user_company = User.objects.get(id=user_id).company
        events = CalendarEvent.objects.filter(company=user_company)
        return CalendarEventSerializer(events, many=True).data
            
    except Exception as e:
        logger.error("Error fetching calendar events: %s", e)
        raise

def create_calendar_event(data, user_id):
    user_company = User.objects.get(id=user_id).company
    data['company'] = user_company.id
    serializer = CalendarEventSerializer(data=data)
    if serializer.is_valid():
        event = serializer.save()
        return CalendarEventSerializer(event).data
    else:
        raise ValueError(serializer.errors)

def update_calendar_event(event_id, data):
    try:
        event = CalendarEvent.objects.get(id=event_id)
        if not event.is_editable:
            raise PermissionError("This calendar event is not editable.")
        
        serializer = CalendarEventSerializer(event, data=data, partial=True)
        if serializer.is_valid():
            event = serializer.save()
            return CalendarEventSerializer(event).data
        else:
            raise ValueError(serializer.errors)
    except ObjectDoesNotExist:
        logger.error("Calendar event with ID %s not found.", event_id)
        raise
    except Exception as e:
        logger.error("Error updating calendar event: %s", e)
        raise

def delete_calendar_event(event_id):
    try:
        event = CalendarEvent.objects.get(id=event_id)
        if event.is_editable:
            event.delete()
            return {"message": "Calendar event deleted."}
        else:
            raise PermissionError("This calendar event is not editable.")
    except ObjectDoesNotExist:
        logger.error("Calendar event with ID %s not found for deletion.", event_id)
        raise
    except Exception as e:
        logger.error("Error deleting calendar event: %s", e)
        raise
