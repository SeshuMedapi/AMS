from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.authentication import PermissionBasedAccess
from django.conf import settings
from api.services.role_service import RoleService
from api.api_models.users import PermissionSerializer, GroupSerializer, RoleSerializer

import logging

class AddRoleView(APIView):
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
        }
        }
    
    def get(self, request):
        try:
            service = RoleService()
            roles = service.list_roles()
            serializer = RoleSerializer(roles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            self.logger.error(f"Error fetching roles: {e}")
            return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        role_name = request.data.get('role_name')
        permissions = request.data.get('permissions')
        
        if not role_name or not permissions:
            return Response({"message": "Role name and permissions are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            service = RoleService()
            role = service.add_role(role_name, permissions)
            serializer = GroupSerializer(role)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except ValueError as ve:
            return Response({"message": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            self.logger.error(f"Error creating role: {e}")
            return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request, role_id):
        role_name = request.data.get('role_name')
        permissions = request.data.get('permissions')

        try:
            service = RoleService()
            role = service.update_role(role_id, role_name, permissions)
            serializer = GroupSerializer(role)
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


