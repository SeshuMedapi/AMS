from ..authentication import SkipAuth, PermissionBasedAccess
from ..services.user_service import UserService
from api.api_models.users import UserSerializer, GroupSerializer, User
from api.exception.app_exception import *
from django.contrib.auth import authenticate
from django.contrib.auth.models import Permission, Group

from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response

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
            permissions =  Permission.objects.filter( group__user__id = user.id )
            permissions_code_names = []
            for permission in permissions:
                permissions_code_names.append(permission.codename)

            return Response({
                            "token": token.key, 
                             "user": UserSerializer(user).data, 
                             "permissions": permissions_code_names
                             })
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class RoleView(APIView):
    permission_classes = [SkipAuth]

    def get(self, request, user_id):
        roles = Group.objects.all()
        if user_id:
            user = User.objects.get(id=user_id)
            role = user.groups.values_list('name', flat=True).first()
            if role == 'HR':
                user_group = ['Manager', 'User']
                roles = Group.objects.filter(name__in=user_group)
            elif role == 'Admin':
                user_group = ['HR', 'Manager', 'User']
                roles = Group.objects.filter(name__in=user_group)
        serializer = GroupSerializer(roles, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


class AdminView(viewsets.ViewSet):
    permission_classes = [SkipAuth]
    # permission_config = {
    #     "post":{
    #                 "permissions": ["create_user"],
    #                 "any": True
    #             }
    #     }

    def post(self, request):
        service = UserService()
        user ={
            'company' : request.data['company'],
            'email': (request.data['email']).lower(),
            'password': request.data['password']
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
        

class UserView(viewsets.ViewSet):
    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "post":{
                    "permissions": ["create_user"],
                    "any": True
                }
        }

    def post(self, request):
        service = UserService()
        user_id = request.query_params.get('user_id')
        user ={
            'email': (request.data['email']).lower(),
            'first_name': request.data['first_name'],
            'last_name': request.data['last_name'],
            'phone_number': request.data['phone_number'],
            'role_id': request.data['role_id'],
            'password': request.data['password']
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

