from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import make_aware
from django.conf import settings
from datetime import datetime
from api.api_models.users import User
from api.services.email_service import EmailService
from api.api_models.calendar import CalendarEvent, CalendarEventSerializer
from api.api_models.notification import Notification
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

    if isinstance(data['date'], str):
        naive_date = datetime.strptime(data['date'], '%Y-%m-%d %H:%M:%S')
        data['date'] = make_aware(naive_date)

    serializer = CalendarEventSerializer(data=data)
    if serializer.is_valid():
        event = serializer.save()
        event_notification(user_company, data)
        return CalendarEventSerializer(event).data
    else:
        raise ValueError(serializer.errors)

from datetime import datetime
from string import Template

def event_notification(company, event):
    users = User.objects.filter(company=company)
    for user in users:
        Notification.objects.create(
            title="Calendar Event Added",
            datetime=make_aware(datetime.now()),
            event="Event Added",
            message=(
                f"Event Name: {event['name']}\n"
                f"Event datetime: {event['date']}\n"
                f"Event Type: {event['type']}\n"
                f"Description: {event['description']}"
            ),
            user=user
        )
    
        formatted_email = settings.EVENT_NOTIFICATION.substitute(
            {
                "first_name": user.first_name,
                "event_name": event['name'],
                "event_datetime": event['date'],
                "event_type": event['type'],
                "description": event['description']
            }
        )
        
        try:
            email_service = EmailService(host=settings.SMTP_EMAIL_HOST, username=settings.SMTP_EMAIL_USERNAME, password=settings.SMTP_EMAIL_PASSWORD)
            email_service.send_smtp_email(
                to_email=user.email,
                content=formatted_email,
                subject=f"{event['name']} - Event Notification"
            )
        except Exception as e:
            logger.error(f"Failed to send email to {user.email}: {e}")

def update_calendar_event(event_id, data):
    try:
        event = CalendarEvent.objects.get(id=event_id)
        if not event.is_editable:
            raise PermissionError("This calendar event is not editable.")
        
        serializer = CalendarEventSerializer(event, data=data, partial=True)
        if serializer.is_valid():
            updated_event = serializer.save()
            users = User.objects.filter(company=updated_event.company)
            for user in users:
                Notification.objects.create(
                    title="Calendar Event Updated",
                    datetime=make_aware(datetime.now()),
                    event="Event Updated",
                    message=(
                        f"Event Name: {updated_event.name}\n"
                        f"Event datetime: {updated_event.date}\n"
                        f"Event Type: {updated_event.type}\n"
                        f"Description: {updated_event.description}"
                    ),
                    user=user
                )

                formatted_email = settings.EVENT_UPDATE_NOTIFICATION.substitute(
                    {
                        "first_name": user.first_name,
                        "event_name": updated_event.name,
                        "event_datetime": updated_event.date,
                        "event_type": updated_event.type,
                        "description": updated_event.description,
                    }
                )

                try:
                    email_service = EmailService(host=settings.SMTP_EMAIL_HOST, username=settings.SMTP_EMAIL_USERNAME, password=settings.SMTP_EMAIL_PASSWORD)
                    email_service.send_smtp_email(
                        to_email=user.email,
                        content=formatted_email,
                        subject="Event Updated Notification"
                    )
                except Exception as e:
                    logger.error(f"Failed to send email to {user.email}: {e}")
            return CalendarEventSerializer(updated_event).data
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
            users = User.objects.filter(company=event.company)
            for user in users:
                Notification.objects.create(
                    title="Calendar Event Deleted",
                    datetime=make_aware(datetime.now()),
                    event="Event Deleted",
                    message=(
                        f"Event Name: {event.name}\n"
                        f"Event datetime: {event.date}\n"
                        f"Event Type: {event.type}\n"
                        f"Description: {event.description}"
                    ),
                    user=user
                )
                formatted_email = settings.EVENT_DELETE_NOTIFICATION.substitute(
                    {
                        "first_name": user.first_name,
                        "event_name": event.name,
                    }
                )

                try:
                    email_service = EmailService(host=settings.SMTP_EMAIL_HOST, username=settings.SMTP_EMAIL_USERNAME, password=settings.SMTP_EMAIL_PASSWORD)
                    email_service.send_smtp_email(
                        to_email=user.email,
                        content=formatted_email,
                        subject="Event Deleted Notification"
                    )
                except Exception as e:
                    logger.error(f"Failed to send email to {user.email}: {e}")
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
