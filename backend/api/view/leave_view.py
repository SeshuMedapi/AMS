from rest_framework import viewsets
from api.exception.app_exception import *
from api.services.leave_service import LeaveService
from rest_framework import status
from rest_framework.response import Response
from ..authentication import *
import logging

class LeaveView(viewsets.ViewSet):
    logger = logging.getLogger("app_log")
    service = LeaveService()
    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "get_myleave" : {
                "permissions": ["request_leave"],
                "any": True
            },
        "request_myleave" : {
                "permissions": ["request_leave"],
                "any": True
            },
        "get_requested_leave" : {
                "permissions": ["approve_leave"],
                "any": True
            },
        "approve_leave" : {
                "permissions": ["approve_leave"],
                "any": True
            },
    }

    def get_myleave(self, request):
        try:
            user = request.user
            response = self.service.myleave(user)
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            self.logger.warning(f"Get Myleave exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def request_myleave(self, request):
        try:
            user = request.user
            response = self.service.leavereq(user)
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            self.logger.warning(f"Request leave exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_requested_leave(self):
        pass

    def approve_leave(Self):
        pass