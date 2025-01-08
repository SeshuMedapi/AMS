from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

from api.api_models.notification import NotificationSerializer
from ..services.notification_service import NotificationService
from ..authentication import PermissionBasedAccess
import logging

class NotificationView(viewsets.ViewSet):

    logger = logging.getLogger("app_log")
    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "get_notification": {
                    "permissions": ["view_company","view_users"],
                    "any": True
                },
        "read_notification": {
                    "permissions": ["view_company","view_users"],
                    "any": True
                },
        "read_all_notification": {
                    "permissions": ["view_company","view_users"],
                    "any": True
                },
        "deactive_notification":{
                    "permissions": ["view_company","view_uses"],
                    "any": True
        },
        "deactive_all_notification" : {
                    "permissions": ["view_company","view_users"],
                    "any": True
        }
        
    }

    def get_notification(self, request):
        try:
            user = request.user
            page = request.query_params.get('page')
            service = NotificationService()
            response = service.get_notification(page, user)
            return Response(NotificationSerializer(response, many=True).data, status=status.HTTP_200_OK)
        except Exception as e:
            self.logger.warning(f"Read notification exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def read_notification(self, request, notification_id):
        try:
            service = NotificationService()
            service.read_notification(notification_id)
            self.logger.info(f"readed the notification id - {notification_id}")
            return Response(f"readed the notification {notification_id}",  status=status.HTTP_200_OK)
        except Exception as e:
            self.logger.warning(f"Read notification exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def read_all_notification(self, request):
        try:
            user = request.user
            service = NotificationService()
            service.read_all_notification(user)
            self.logger.info(f"read all the notification belongs to {user}")
            return Response(f"read all the notification belongs to {user}",  status=status.HTTP_200_OK)
        except Exception as e:
            self.logger.warning(f"Read notification exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def deactive_notification(self, request, notification_id):
        try:
            service = NotificationService()
            service.deactivate_notification(notification_id)
            self.logger.info(f"deactivated the notification id - {notification_id}")
            return Response(f"deactivated the notification {notification_id}",  status=status.HTTP_200_OK)
        except Exception as e:
            self.logger.warning(f"Deactivate notification exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def deactive_all_notification(self, request):
        try:
            user = request.user
            service = NotificationService()
            service.deactivate_all_notification(user)
            self.logger.info(f"deactivated all the notification belongs to {user}")
            return Response(f"deactivated all the notification belongs to {user}",  status=status.HTTP_200_OK)
        except Exception as e:
            self.logger.warning(f"Deactivate notification exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)