from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from api.api_models.custom_group import CustomGroupSerializer
from api.exception.app_exception import *
from django.core.exceptions import ValidationError
from api.authentication import PermissionBasedAccess
from django.conf import settings
from api.services.role_service import RoleService
from api.api_models.users import PermissionSerializer, GroupSerializer, RoleSerializer

import logging

class ActivateRoleview(viewsets.ViewSet):
    logger = logging.getLogger("app_log")
    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "activateRole_or_deactivateRole" :{
            "permissions": ["activate_role"],
            "any": True
        }
    }

    def activateRole_or_deactivateRole(self, request):
        try:
            self.logger.info("Role Activate or Deactivate")
            service = RoleService()
            role_id = request.data['role_id']
            activate = request.data['activate']
            service.activateRoleOrDeactivateRole(role_id, activate)
            return Response({"status":"success"}, status=status.HTTP_200_OK)
        except ValidationError as e:
            self.logger.warning(f"Role activate or deactivate exception {e}")
            return Response({"message": f"Invalid post data {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except RoleNotFound as e:
            self.logger.warning(f"Role not found for activate or deactivate {e}")
            return Response({"message":"Role not found for activate or deactivate"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            self.logger.exception(f"Role activate or deactivate Exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except e:
            self.logger.exception(f"Role activate or deactivate Exception: {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AddRoleView(viewsets.ViewSet):
    logger = logging.getLogger("app_log")
    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "get":{
                    "permissions": ["add_role"],
                    "any": True
                },
        "post":{
                    "permissions": ["add_role"],
                    "any": True
                },
        "put":{
                    "permissions": ["edit_role"],
                    "any": True
        },
        "delete":{
                    "permissions": ["edit_role"],
                    "any": True
        },
        }
    
    def get(self, request, user_id):
        try:
            service = RoleService()
            roles = service.list_roles(user_id)
            # serializer = RoleSerializer(roles, many=True)
            return Response(roles, status=status.HTTP_200_OK)
        except Exception as e:
            self.logger.error(f"Error fetching roles: {e}")
            return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, user_id):
        role_name = request.data.get('role_name')
        permissions = request.data.get('permissions')

        if not role_name or not permissions:
            return Response({"message": "Role name and permissions are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            service = RoleService()
            custom_group = service.add_role(role_name, permissions, user_id)
            serializer = CustomGroupSerializer(custom_group)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValueError as ve:
            return Response({"message": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            self.logger.error(f"Error creating role: {e}")
            return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request, role_id):
        role_name = request.data.get('role_name')
        permissions = request.data.get('permissions')
        user_company = request.user.company

        try:
            service = RoleService()
            role = service.update_role(role_id, role_name, permissions, user_company)
            serializer = CustomGroupSerializer(role)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError as ve:
            return Response({"message": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            self.logger.error(f"Error updating role: {e}")
            return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, role_id):
        try:
            service = RoleService()
            service.delete_role(role_id)
            return Response({"message": "Role deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except ValueError as ve:
            return Response({"message": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            self.logger.error(f"Error deleting role: {e}")
            return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PermissionView(APIView):
    logger = logging.getLogger("app_log")
    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "get":{
                    "permissions": ["add_role"],
                    "any": True
                },
        }

    def get(self, request):
        try:
            service = RoleService()
            response = service.list_permissions()
            serializer = PermissionSerializer(response, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            self.logger.warning(f"Get Permission list exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


