from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import permissions
from django.contrib.auth.models import Permission, Group
from api.api_models.custom_group import CustomGroup

from datetime import timedelta
from django.utils import timezone
from django.conf import settings


#this return left time
def expires_in(token):
    time_elapsed = timezone.now() - token.created
    left_time = timedelta(seconds = settings.TOKEN_EXPIRED_AFTER_SECONDS) - time_elapsed
    return left_time

# token checker if token expired or not
def is_token_expired(token):
    return expires_in(token) < timedelta(seconds = 0)

# if token is expired new token will be established
# If token is expired then it will be removed
def token_expire_handler(token):
    is_expired = is_token_expired(token)
    if is_expired:
        token.delete()
        #token = Token.objects.create(user = token.user)
    return is_expired, token


#________________________________________________
#DEFAULT_AUTHENTICATION_CLASSES
class ExpiringTokenAuthentication(TokenAuthentication):
    """
    If token is expired then it will be removed
    and new one with different key will be created in the login
    """
    def authenticate_credentials(self, key):
        try:
            token = Token.objects.get(key = key)
        except Token.DoesNotExist:
            raise AuthenticationFailed("Invalid Main Token")
        
        if not token.user.is_active:
            raise AuthenticationFailed("User is not active")

        is_expired, token = token_expire_handler(token)
        if is_expired:
            raise AuthenticationFailed("The Token is expired")
        token.created = timezone.now()
        token.save()
        return (token.user, token)

class SkipAuth(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return True

class PermissionBasedAccess(permissions.IsAuthenticated):
        def has_permission(self, request, view):

            isAuth = super().has_permission(request, view)
            if not hasattr(view,'permission_config'):
                return isAuth

            method = None
            if hasattr(view,'action'):
                 method = view.action
            else:
                method = request.method.lower()

            method_permission_config = view.permission_config.get(method)
            if not method_permission_config:
                return isAuth
            
            method_permissions = method_permission_config.get('permissions')
            isAuthorized  = False

            if not method_permissions or len(method_permissions) == 0:
                isAuthorized = False
            else:
                isAny = method_permission_config.get('any')

                method_permission = [i.id for i in Permission.objects.filter(codename__in=method_permissions)]
                
                if request.user.id != 1:
                    if isAny:
                        isAuthorized = CustomGroup.objects.filter(
                                company=request.user.company, 
                                permissions__in= method_permission
                                ).exists()
                    else:
                        isAuthorized = CustomGroup.objects.filter(
                                company=request.user.company, 
                                permissions__contains= method_permission
                                ).exists()
                else:
                    if isAny:
                        isAuthorized = Permission.objects.filter(
                                group__user__id=request.user.id, 
                                codename__in= method_permissions
                                ).exists()
                    else:
                        isAuthorized = Permission.objects.filter(
                                group__user__id=request.user.id, 
                                codename__contains = method_permissions
                                ).exists()
            return (isAuth and isAuthorized)


class UserPermission:
    def get_own_claims_only_user_permission(user):
        try:
            own_claims_permission = Permission.objects.get(codename='own_claims_only')
        except Permission.DoesNotExist:
            own_claims_permission = None

        if own_claims_permission:
            if user.user_permissions.filter(id=own_claims_permission.id).exists():
                return user.id
            user_group_ids = user.groups.values_list('id', flat=True)
            if Group.objects.filter(id__in=user_group_ids, permissions=own_claims_permission).exists():
                return user.id
        return None

    def get_invoice_generation_user_permission(user):
        try:
            own_claims_permission = Permission.objects.get(codename='invoice_generation')
        except Permission.DoesNotExist:
            own_claims_permission = None

        if own_claims_permission:
            if user.user_permissions.filter(id=own_claims_permission.id).exists():
                return user.id
            user_group_ids = user.groups.values_list('id', flat=True)
            if Group.objects.filter(id__in=user_group_ids, permissions=own_claims_permission).exists():
                return user.id
        return None
    
    def get_is_override_user_permission(user):
        try:
            is_override_permission = Permission.objects.get(codename='demand_amount_override')
        except Permission.DoesNotExist:
            is_override_permission = None

        if is_override_permission:
            if user.user_permissions.filter(id=is_override_permission.id).exists():
                return user.id
            user_group_ids = user.groups.values_list('id', flat=True)
            if Group.objects.filter(id__in=user_group_ids, permissions=is_override_permission).exists():
                return user.id
        return None
    
    def get_subrogation_status_override_user_permission(user):
        try:
            is_override_permission = Permission.objects.get(codename='subrogation_status_override')
        except Permission.DoesNotExist:
            is_override_permission = None

        if is_override_permission:
            if user.user_permissions.filter(id=is_override_permission.id).exists():
                return user.id
            user_group_ids = user.groups.values_list('id', flat=True)
            if Group.objects.filter(id__in=user_group_ids, permissions=is_override_permission).exists():
                return user.id
        return None