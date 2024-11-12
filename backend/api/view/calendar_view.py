from ..authentication import PermissionBasedAccess
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from ..services.calendar_service import (
    get_all_calendar_events, 
    create_calendar_event, 
    update_calendar_event, 
    delete_calendar_event
)

class CalendarEventsView(viewsets.ViewSet):
    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "get":{
                    "permissions": ["view_calendar"],
                    "any": True
                },
        "post":{
                    "permissions": ["edit_calendar"],
                    "any": True
                },
        "delete":{
                    "permissions": ["edit_calendar"],
                    "any": True
        }
        }
    def get(self, request, user_id):
        try:
            events_data = get_all_calendar_events(user_id)
            return Response(events_data, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Error fetching calendar events"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, user_id):
        data = request.data
        try:
            if 'id' in data:
                event_data = update_calendar_event(data['id'], data)
                return Response(event_data, status=status.HTTP_200_OK)
            else:
                event_data = create_calendar_event(data,user_id)
                return Response(event_data, status=status.HTTP_201_CREATED)
        except PermissionError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": e.args[0]}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"error": "Error processing request"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, event_id):
        try:
            result = delete_calendar_event(event_id)
            return Response(result, status=status.HTTP_200_OK)
        except PermissionError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response({"error": "Calendar event not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({"error": "Error deleting calendar event"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
