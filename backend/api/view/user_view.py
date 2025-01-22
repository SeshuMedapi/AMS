from ..authentication import SkipAuth, PermissionBasedAccess
from ..services.user_service import UserService
from api.api_models.users import UserSerializer, GroupSerializer, User
from api.api_models.company import AdminUserSerializer, Company
from api.api_models.company_branch import CompanyBranch, CompanyBranchSerializer
from api.api_models.custom_group import CustomGroup
from api.exception.app_exception import *
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from django.contrib.auth.models import Permission, Group
from django.core.files.uploadedfile import UploadedFile
from django.conf import settings

from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response

import logging
ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif']

class LoginView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [SkipAuth] 

    def post(self, request):
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user:
            old_token = Token.objects.filter(user=user).first()
            if old_token:
                old_token.delete()
            token, created = Token.objects.get_or_create(user=user)
            permissions_code_names = []
            if user.groups.filter(name__in=['SuperAdmin', 'Admin']).exists():
                permissions = Permission.objects.filter(group__user=user)
                permissions_code_names = [permission.codename for permission in permissions]
            else:
                custom_groups = user.groups.prefetch_related('custom_groups__permissions')
                for custom_group in custom_groups:
                    permissions = custom_group.custom_groups.first().permissions.all()
                    permissions_code_names.extend(permissions.values_list('codename', flat=True))

            return Response({
                            "token": token.key, 
                             "user": UserSerializer(user).data, 
                             "session_time": settings.TOKEN_EXPIRED_AFTER_SECONDS,
                             "permissions": permissions_code_names
                             })
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):

    def get(self, request):
        key = request.auth.key
        token = Token.objects.get(key = key)
        if token:
            token.delete()
        return Response({'status': 'success'}, status=status.HTTP_200_OK)

class RoleView(APIView):
    permission_classes = [SkipAuth]

    def get(self, request, user_id):
        roles = Group.objects.all()
        if user_id:
            user = User.objects.get(id=user_id,is_active=True)
            role = user.groups.values_list('name', flat=True).first()
            if role == 'HR':
                user_group = ['SuperAdmin', 'Admin','HR']                
                roles_in = CustomGroup.objects.filter(company_id=user.company.id)
                roles = Group.objects.filter(id__in=[i.group_id for i in roles_in]).exclude(name__in=user_group)
            elif role == 'Admin':
                user_group = ['SuperAdmin', 'Admin']
                roles_in = CustomGroup.objects.filter(company_id=user.company.id)
                roles = Group.objects.filter(id__in=[i.group_id for i in roles_in]).exclude(name__in=user_group)
            else:
                user_group = ['SuperAdmin', 'Admin','HR', 'Manager']
                roles_in = CustomGroup.objects.filter(company_id=user.company.id)
                roles = Group.objects.filter(id__in=[i.group_id for i in roles_in]).exclude(name__in=user_group)
        print(roles)
        serializer = GroupSerializer(roles, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


class AdminView(viewsets.ViewSet):
    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "get":{
                    "permissions": ["view_company","view_users"],
                    "any": True
                },
        "post":{
                    "permissions": ["create_company"],
                    "any": True
                },
        "delete":{
                    "permissions": ["delete_company"],
                    "any": True
        }
        }

    def get(self, request):
        admin_users = User.objects.filter(groups__name='Admin').distinct()
        
        admin_user_data = []
        for user in admin_users:
            admin_user_data.append({   
                'id':user.id,
                'company_id': user.company.id,
                'company': user.company.name,
                'email': user.email,
                'is_active': user.is_active
            })
        serializer = AdminUserSerializer(admin_user_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        service = UserService()
        user ={
            'company' : request.data['company'],
            'email': (request.data['email']).lower()
        }
 
        try:
            user = service.createAdmin(**user)
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        except CompanyExistException as e:
            return Response({"message":f"Company already registered"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationException as e:
            return Response({"message":f"Invalid post data {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except UserNameConflict as e:
            return Response({"message": f"Email id already exist: {e}"}, status=status.HTTP_409_CONFLICT)
        except Exception as e:
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except e:
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, company_id=None):
        try:
            company = Company.objects.get(id=company_id)
            company.delete()

            return Response({"message": f"Company with ID {company_id} and its related data were successfully deleted."}, status=status.HTTP_200_OK)
        except Company.DoesNotExist:
            return Response({"message": f"Company with ID {company_id} does not exist."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"Failed to delete company: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ResetPassword(viewsets.ViewSet):
    permission_classes = [SkipAuth] 
    logger = logging.getLogger("app_log")

    def post_reset_password_request(self, request):
        try:
            email = (request.data["email"]).lower()
            service = UserService()
            if service.passwordResetRequest(email):
                return Response({"status":"sent"}, status=status.HTTP_200_OK)
            else:
                return Response({"status":"Email Not Found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            self.logger.exception(f"User creation Exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except e:
            self.logger.exception(f"Reset password request exception: {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post_set_new_password(self, request):
        try:
            token = request.data['token']
            new_password = request.data['password']
            service = UserService()
            service.setNewPassword(token,new_password)
            return Response({"status":"success"}, status=status.HTTP_200_OK)
        except ResetPasswordTokenExpired as e:
            self.logger.warning(f"Reset password token expired {e}")
            return Response({"status":"token expired"}, status=status.HTTP_400_BAD_REQUEST)
        except InvalidResetPasswordToken as e:
            self.logger.exception(f"Invalid reset password token {e}")
            return Response({"message":"Invalid Token"}, status=status.HTTP_400_BAD_REQUEST)
        except PasswordPolicyViolation as e:
            self.logger.exception(f"Password Policy Violation {e}")
            return Response({"message": f"Password Policy Violation: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            self.logger.exception(f"Set new password exception: {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post_is_reset_password_valid(self, request):
        token = request.data['token']
        try:
            service = UserService()
            service.isTokenValid(token)
            return Response({"status":"success"}, status=status.HTTP_200_OK)
        except ResetPasswordTokenExpired as e:
            self.logger.warning(f"Reset password token expired {e}")
            return Response({"status":"token expired"}, status=status.HTTP_400_BAD_REQUEST)
        except InvalidResetPasswordToken as e:
            self.logger.exception(f"Invalid reset password token {e}")
            return Response({"message":"Invalid Token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            self.logger.exception(f"Set new password exception: {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class UserView(viewsets.ViewSet):
    logger = logging.getLogger("app_log")
    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "get":{
                    "permissions": ["view_users"],
                    "any": True
                },
        "post":{
                    "permissions": ["create_user"],
                    "any": True
                },

        "put":{
            "permissions" : ["edit_user"],
            "any" : True
        },
        "activateUser_or_deactivateUser" :{
            "permissions": ["activate_user"],
            "any": True
        }
        }
    
    def get(self, request):
        service = UserService()
        user_id = request.query_params.get('user_id')
        try:
            user = service.GetUsers(user_id)
            serializer = UserSerializer(user, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        service = UserService()
        user_id = request.query_params.get('user_id')
        user ={
            'email': (request.data['email']).lower(),
            'first_name': request.data['first_name'],
            'last_name': request.data['last_name'],
            'phone_number': request.data['phone_number'],
            'role_id': request.data['role_id']
        }
 
        try:
            user = service.createUser(user_id, **user)
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        except ValidationException as e:
            return Response({"message":f"Invalid post data {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except UserNameConflict as e:
            return Response({"message": f"Email id already exist: {e}"}, status=status.HTTP_409_CONFLICT)
        except Exception as e:
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except e:
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request):
        try:
            self.logger.info("User update")
            service = UserService()
            user ={
                'id':request.data['id'],
                'first_name': request.data['first_name'],
                'last_name': request.data['last_name'],
                'phone_number': request.data['phone_number'],
                # 'role_id': request.data['role_id']                
                }
            user = service.updateUser(**user)
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        except ValidationError as e:
            self.logger.warning(f"User edit exception {e}")
            return Response({"message": f"Invalid post data {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationException as e:
            self.logger.warning(f"User edit exception {e}")
            return Response({"message": f"Invalid post data {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except UserNotFound as e:
            self.logger.warning(f"User not found for edit {e}")
            return Response({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            self.logger.exception(f"User edit Exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except e:
            self.logger.exception(f"User edit Exception: {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def activateUser_or_deactivateUser(self, request):
        try:
            self.logger.info("User Activate or Deactivate")
            service = UserService()
            user_id = request.data['user_id']
            activate = request.data['activate']
            service.activateUserOrDeactivateUser(user_id, activate)
            return Response({"status":"success"}, status=status.HTTP_200_OK)
        except ValidationError as e:
            self.logger.warning(f"User activate or deactivate exception {e}")
            return Response({"message": f"Invalid post data {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except UserNotFound as e:
            self.logger.warning(f"User not found for activate or deactivate {e}")
            return Response({"message":"User not found for activate or deactivate"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            self.logger.exception(f"User activate or deactivate Exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except e:
            self.logger.exception(f"User activate or deactivate Exception: {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def validate_image_file(upload_file):
    """
    Validate that the uploaded file is an image file.
    """
    if not isinstance(upload_file, UploadedFile):
        raise ValidationError("File type is not valid.")

    if not upload_file.name.lower().endswith(tuple(ALLOWED_IMAGE_EXTENSIONS)):
        raise ValidationError("Only image files (jpg, jpeg, png, gif) are allowed.")

class ProfilePictureView(APIView):
    logger = logging.getLogger("app_log")

    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "get": {
                    "permissions": ["view_users"],
                    "any": True
                },
        "post":{
                    "permissions": ["view_users"],
                    "any": True
                }
    }

    def get(self, request):
        try:
            user_service = UserService()
            response = user_service.get_profile_picture(request.user)
            if response:
                return response
            else:
                raise NotFound("File not found")

        except PermissionException as e:
            self.logger.warning(f"{e}")
            return Response({"message":"Access denied, permission not found"}, status=status.HTTP_403_FORBIDDEN)
        except NotFound as e:
            self.logger.warning(f"{e}")
            return Response({"message": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except ValidationException as e:
            self.logger.warning(f"{e}")
            return Response({"message":"Invalid get data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            self.logger.warning(f"{e}")
            return Response({"message": "Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            user_service = UserService()
            upload_file = request.FILES.get('profile_picture') or None

            if upload_file:
                validate_image_file(upload_file)
                response = user_service.update_profile_picture(upload_file, request.user)
                if response:
                    return Response({"message": "File uploaded successfully"},status=status.HTTP_200_OK)
                else:
                    raise Exception("File upload failed")
            else:
                raise ValidationException("Required fields to api is missing")
        except PermissionException as e:
            self.logger.warning(f"{e}")
            return Response({"message":"Access denied, permission not found"}, status=status.HTTP_403_FORBIDDEN)
        except NotFound as e:
            self.logger.warning(f"{e}")
            return Response({"message": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            self.logger.warning(f"{e}")
            error_message = "Validation Error: "
            errors = e
            for error in errors:
                error_message += f"{error}. "
            return Response({"message": error_message}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationException as e:
            self.logger.warning(f"{e}")
            return Response({"message":"Invalid get data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            self.logger.warning(f"{e}")
            return Response({"message": "Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BranchView(APIView):
    logger = logging.getLogger("app_log")

    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "get": {
                    "permissions": ["add_branch"],
                    "any": True
                },
        "post":{
                    "permissions": ["add_branch"],
                    "any": True
                }
    }

    def get(self, request, user_id):
        pass
        # try:
        #     service = UserService()
        #     roles = service.list_roles(user_id)
        #     # serializer = RoleSerializer(roles, many=True)
        #     return Response(roles, status=status.HTTP_200_OK)
        # except Exception as e:
        #     self.logger.error(f"Error fetching roles: {e}")
        #     return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            user_id = request.user.id

            company_id = User.objects.get(id=user_id).company
            service = UserService()
            branch = service.add_branch(company_id, request.data)
            serializer = CompanyBranchSerializer(branch)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValueError as ve:
            return Response({"message": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            self.logger.error(f"Error creating role: {e}")
            return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # def put(self, request, role_id):
    #     role_name = request.data.get('role_name')
    #     permissions = request.data.get('permissions')
    #     user_company = request.user.company

    #     try:
    #         service = UserService()
    #         role = service.update_role(role_id, role_name, permissions, user_company)
    #         serializer = CustomGroupSerializer(role)
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     except ValueError as ve:
    #         return Response({"message": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
    #     except Exception as e:
    #         self.logger.error(f"Error updating role: {e}")
    #         return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # def delete(self, request, role_id):
    #     try:
    #         service = UserService()
    #         service.delete_role(role_id)
    #         return Response({"message": "Role deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    #     except ValueError as ve:
    #         return Response({"message": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
    #     except Exception as e:
    #         self.logger.error(f"Error deleting role: {e}")
    #         return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)