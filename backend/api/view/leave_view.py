from rest_framework import viewsets
from api.exception.app_exception import *
from api.api_models.leave_type import Leavetype
from api.api_models.req_status import Reqstatus
from api.api_models.leave_request import LeaveRequestSerializer
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
            serializer = LeaveRequestSerializer(response, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            self.logger.warning(f"Get Myleave exception: {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def request_myleave(self, request):
        try:
            user = request.user
            response = self.service.leavereq(user, request.data)
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            self.logger.warning(f"Request leave exception: {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_requested_leave(self):
        pass

    def approve_leave(Self):
        pass

class LeaveStatusView(viewsets.ViewSet):
    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "get_reqstatus" :{
            "permissions" : ["request_leave"],
            "any" : True
        },
        "get_leavetype" :{
            "permissions" : ["request_leave"],
            "any" : True
        }
    }

    def get_reqstatus(self, request):
        try:
            statuses = Reqstatus.objects.all()
            status_data = [{"id": status.id, "name": status.status} for status in statuses]

            return Response({"status": status_data}, status=200)

        except Exception as e:
            return Response({"message": f"Error retrieving leave statuses: {str(e)}"}, status=500)

    def get_leavetype(self, request):
        try:
            leave_types = Leavetype.objects.all()
            leave_type_data = [{"id": leave_type.id, "name": leave_type.leavetype} for leave_type in leave_types]

            return Response({"leave_types": leave_type_data}, status=200)

        except Exception as e:
            return Response({"message": f"Error retrieving leave types: {str(e)}"}, status=500)