import logging
from ..api_models.users import User
from ..services.user_service import UserService
from rest_framework.response import Response
from rest_framework import status
from ..exception.app_exception import *
from ..authentication import SkipAuth, PermissionBasedAccess
from rest_framework import viewsets
from django.contrib.auth.models import Permission
from django.core.exceptions import ValidationError

class MyinfoView(viewsets.ViewSet):

    logger = logging.getLogger("app_log")

    def get(self, request):
        service = UserService()
        user = request.user
        try:
            self.logger.info(f"Get my info for id:{user.id}")
            user_info = service.getUser(user.id)
            return Response({"email": user_info['email'], "first_name": user_info['first_name'], "last_name": user_info['last_name'],
                                "phone_number": user_info['phone_number']}, status=status.HTTP_200_OK)
        except UserNotFound as e:
            self.logger.warning(f"My info not found for edit {e}")
            return Response({"message":"My User info not found or invalid"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            self.logger.warning(f"Get my info Exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        try:
            self.logger.info("My Info update")
            service = UserService()
            user = request.user
            user_info = service.getUser(user.id)
            user_upd ={
                'id':user_info['id'],
                'first_name': request.data['first_name'],
                'last_name': request.data['last_name'],
                'phone_number': request.data['phone_number'],
                }
            user_upd = service.updateMyinfo(**user_upd)
            return Response({"email": user_upd.email, "first_name": user_upd.first_name, "last_name": user_upd.last_name,
                                "phone_number": user_upd.phone_number}, status=status.HTTP_200_OK)
        except ValidationError as e:
            self.logger.warning(f"My info edit exception {e}")
            return Response({"message": f"Invalid post data {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except (ValidationException, KeyError) as e:
            self.logger.warning(f"My info edit exception {e}")
            return Response({"message": f"Invalid or missing post data {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except UserNotFound as e:
            self.logger.warning(f"My info not found for edit {e}")
            return Response({"message":"My info not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            self.logger.exception(f"My info edit Exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except e:
            self.logger.exception(f"My info edit Exception: {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def change_my_password(self, request):
        try:
            self.logger.info("Change My Password")
            service = UserService()
            service.change_password(request.user, request.data['old_password'], request.data['new_password'])
            return Response({"status":"success"}, status=status.HTTP_200_OK)
        except PasswordPolicyViolation as e:
            self.logger.exception(f"Password Policy Violation {e}")
            return Response({"message": f"Password Policy Violation: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except UserNotFound as e:
            self.logger.warning(f"User not found for password change {e}")
            return Response({"message":"Invalid user"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            self.logger.exception(f"Change Password Exception {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except e:
            self.logger.exception(f"Change password Exception: {e}")
            return Response({"message":"Internal Server Exception"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 