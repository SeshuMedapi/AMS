from api.api_models.users import User
from django.db import transaction
from api.api_models.reset_password import ResetPassword
from api.api_models.company import Company
from api.api_models.custom_group import CustomGroup
from api.api_models.company_branch import CompanyBranch
from api.services.email_service import EmailService
from django.http import JsonResponse
from django.contrib.auth.models import Group
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.storage import FileSystemStorage
from django.http import Http404
from api.exception.app_exception import *
from django.conf import settings
from django.db.models import F
from mimetypes import guess_type
from datetime import datetime
import uuid, re, os, logging

class UserService():
    logger = logging.getLogger("app_log")

    email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    password_rule = r'^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$]).{8,}$'

    def GetUsers(self, user_id):
        user_ = User.objects.get(id=user_id)
        role_id = user_.groups.values_list('id', flat=True).first()

        Admin = Group.objects.get(name="Admin")
        hr = Group.objects.get(name="HR")
        manager = Group.objects.get(name="Manager")

        admin_ids = Group.objects.exclude(name__in=['SuperAdmin', 'Admin']).values_list('id', flat=True)
        hr_ids = Group.objects.exclude(name__in=['SuperAdmin', 'Admin', 'HR']).values_list('id', flat=True)
        manager_ids = Group.objects.exclude(name__in=['SuperAdmin', 'Admin', 'HR', 'Manager']).values_list('id', flat=True)

        if role_id == Admin.id:
            users = User.objects.filter(groups__id__in=admin_ids,company=user_.company).annotate(group_name=F('groups__name'))
        elif role_id == hr.id:
            users = User.objects.filter(groups__id__in=hr_ids,company=user_.company).annotate(group_name=F('groups__name'))
        elif role_id == manager.id:
            users = User.objects.filter(groups__id__in=manager_ids,company=user_.company).annotate(group_name=F('groups__name'))
        else:
            users = User.objects.none()

        return users
    
    def activateUserOrDeactivateUser(self, id, isActivate):
        user = User.objects.filter(id=id).first()
        if user:
            user.is_active = isActivate
            user.save()
        else:
            raise UserNotFound

    @transaction.atomic()
    def createAdmin(self, **kwargs):
        if Company.objects.filter(name=kwargs.get('company')):
            raise CompanyExistException
        company = Company.objects.create(name=kwargs.get('company'))
        company.save()
        user = User()
        user.email = kwargs.get('email')
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.company = company
        user.password = make_password("Jivass@123")
        self._validateUserCreation(user.email)
        user.save()
        if user:
            reset_token = uuid.uuid1().hex
            ResetPassword.objects.create(
                user_id = user.id,
                reset_token = reset_token
            )
            
            role = Group.objects.get(name='Admin')
            user.groups.clear()
            user.groups.add(role)

            for i in Group.objects.filter(name__in=settings.ROLES).exclude(name__in=['SuperAdmin','Admin']):
                if not CustomGroup.objects.filter(group_id=i.id, company=user.company).exists():        
                    c = CustomGroup.objects.create(
                        group_id=i.id,
                        company_id=user.company.id
                    )
                    c.save()

                    permissions = i.permissions.all()
                    c.permissions.set(permissions)
                else:
                    print(f"CustomGroup already exists for Group ID: {i.id}")

            formatted_email = settings.WELCOME_COMPANY_EMAIL.substitute(
                        {"company": user.company,
                        "password_reset_url": (f"{settings.APP_DOMAIN_BASE_URL}/ResetPassword?token={reset_token}"),
                        "email": user.email
                        })
            EmailService(settings.SMTP_EMAIL_HOST, settings.SMTP_EMAIL_USERNAME, settings.SMTP_EMAIL_PASSWORD).send_smtp_email(user.email, formatted_email, "Attendance Management Portal - welcome")
            return user

    def createUser(self, user_id, **kwargs):
        company = User.objects.get(id=user_id).company
        user = User()
        user.email = kwargs.get('email')
        user.first_name = kwargs.get('first_name')
        user.last_name = kwargs.get('last_name')
        user.phone_number = kwargs.get('phone_number')
        user.branch_id = kwargs.get('branch_id')
        user.password = make_password("Jivass@123")
        user.is_active = True
        user.company = company
        user.is_staff = True
        user.is_superuser = True
        self._validateUserCreation(user.email)
        with transaction.atomic():
            user.save()
            reset_token = uuid.uuid1().hex
            ResetPassword.objects.create(
                user_id = user.id,
                reset_token = reset_token
            )
            role = Group.objects.get(id=kwargs.get('role_id'))
            user.groups.clear()
            user.groups.add(role)
            

            formatted_email = settings.WELCOME_COMPANY_EMAIL.substitute(
                        {"company": user.company,
                        "password_reset_url": (f"{settings.APP_DOMAIN_BASE_URL}/ResetPassword?token={reset_token}"),
                        "email": user.email
                        })
            EmailService(settings.SMTP_EMAIL_HOST, settings.SMTP_EMAIL_USERNAME, settings.SMTP_EMAIL_PASSWORD).send_smtp_email(user.email, formatted_email, "Attendance Management Portal - welcome")
            return user
        
    def updateUser(self, user_id,**kwargs):
        user = User.objects.filter(id=user_id).first()
        branch=CompanyBranch.objects.get(id=kwargs.get('branch_id'))
        if user:
            user.first_name = kwargs.get('first_name')
            user.last_name = kwargs.get('last_name')
            user.phone_number = kwargs.get('phone_number')
            user.branch = branch
            self._validateUserUpdate(user)
            with transaction.atomic():
                user.save()
                role = Group.objects.get(id=kwargs.get('role_id'))
                user.groups.clear()
                user.groups.add(role)
                role.save()
            return user
        else:
            raise UserNotFound

    # def updateUser(self, user_id, user_data):
    #     try:
    #         user = User.objects.filter(id=user_id).first()
    #         if not user:
    #             raise UserNotFound(f"User with ID {user_id} not found")

    #         self.logger.info(f"Existing user: {user}")

    #         # Manually update role and branch
    #         role_id = user_data.pop('role_id', None)
    #         branch_id = user_data.pop('branch_id', None)

    #         if role_id:
    #             role = Group.objects.filter(id=role_id).first()
    #             if role:
    #                 user.groups.clear()
    #                 user.groups.add(role)

    #         if branch_id:
    #             branch = CompanyBranch.objects.filter(id=branch_id).first()
    #             if branch:
    #                 user.branch = branch

    #         # Updating other fields using the existing serializer
    #         for key, value in user_data.items():
    #             setattr(user, key, value)

    #         with transaction.atomic():
    #             user.save()

    #         self.logger.info(f"User {user_id} updated successfully.")
    #         return user
    #     except Exception as e:
    #         self.logger.exception(f"Error updating user {user_id}: {e}")
    #         raise e
        
    def _validateUserUpdate(self, user):
        if not user.email:
            raise ValidationException("Invalid email id")
        if not re.fullmatch(self.email_regex, user.email):
            raise ValidationException(f"Invalid email id {user.email}")
    
    def _validateUserCreation(self, user):
        if not user:
            raise ValidationException("Invalid email id")
        if not re.fullmatch(self.email_regex, user):
            raise ValidationException(f"Invalid email id {user}")
        existing_user = User.objects.filter(email=user).first()
        
        if existing_user:
            raise UserNameConflict(f"{user}")
        
    def passwordResetRequest(self, email):
        if not email:
            return False
        
        user = User.objects.filter(email=email).first()
        if user:
            reset_token = uuid.uuid1().hex
            ResetPassword.objects.create(
                user_id = user.id,
                reset_token = reset_token
            )
            formatted_email = settings.RESET_PASSWORD.substitute(
                        {"first_name": user.first_name,
                         "last_name": user.last_name,
                         "password_reset_url": (f"{settings.APP_DOMAIN_BASE_URL}/ResetPassword?token={reset_token}")
                         })
            EmailService(settings.SMTP_EMAIL_HOST, settings.SMTP_EMAIL_USERNAME, settings.SMTP_EMAIL_PASSWORD).send_smtp_email(user.email, formatted_email, "Attendance Management Portal - Password reset request")
            return True
        else:
            return False

    def setNewPassword(self, token, new_password):
        reset_password_req = ResetPassword.objects.filter(reset_token = token).first()
        if reset_password_req:
            diff = datetime.now() - reset_password_req.date_time.replace(tzinfo=None)
            if diff.days <= settings.RESET_PASSWORD_TOKEN_EXPIRE_DAYS:
                user = User.objects.get(id=reset_password_req.user_id)
                self._check_password_policy(new_password)
                user.password = make_password(new_password)
                user.save()
                reset_password_req.delete()
            else:
                reset_password_req.delete()
                raise ResetPasswordTokenExpired
        else:
            raise InvalidResetPasswordToken

    def isTokenValid(self, token):
        reset_password_req = ResetPassword.objects.filter(reset_token = token).first()
        if reset_password_req:
            diff = datetime.now() - reset_password_req.date_time.replace(tzinfo=None)
            if diff.days <= settings.RESET_PASSWORD_TOKEN_EXPIRE_DAYS:
                return True
            else:
                raise ResetPasswordTokenExpired
        else:
            raise InvalidResetPasswordToken

    def _check_password_policy(self, password):
         if not re.fullmatch(self.password_rule, password):
            raise PasswordPolicyViolation(f"At least 8 characters <br/>"
                             f"At least one capital letter <br/>"
                             f"At least one number <br/>"
                             f"At least one special character from (@,#,$)")

    def get_profile_picture(self, user):
        try:
            user_obj = User.objects.get(id=user.id)
            
            if user_obj:
                relative_filepath = user_obj.profile_picture_filepath
                absolute_filepath = os.path.join(settings.MEDIA_ROOT, relative_filepath)
                
                if not os.path.exists(absolute_filepath):
                    raise Http404("Profile picture not found.")
                
                file_type = guess_type(absolute_filepath)[0] or "application/octet-stream"
                
                response = {
                    'content_type': file_type,
                    'url': f"{settings.MEDIA_URL}{relative_filepath}",
                    'file_type': relative_filepath.split('.')[-1],
                }
                return JsonResponse(response)
            else:
                raise Http404("The requested user does not exist.")
        except User.DoesNotExist:
            raise Http404("The requested user does not exist.")
        except Exception as e:
            raise Exception(e)

    def update_profile_picture(self, upload_file, user):
        response = None
        file_type = None
        field_name = "profile_pictures"
        try:
            filename = upload_file.name
            file_type = filename.split(".")[-1]

            upload_folder = os.path.join(settings.MEDIA_ROOT, field_name)
            os.makedirs(upload_folder, exist_ok=True)

            blob_name = f"{user.id}.{file_type}"

            file_path = os.path.join(upload_folder, blob_name)

            if os.path.exists(file_path):
                os.remove(file_path)

            file_system = FileSystemStorage(location=upload_folder)
            file_system.save(blob_name, upload_file)
            response = True
        except Exception as e:
            return False

        try:
            if response:
                with transaction.atomic():
                    user_obj = User.objects.get(id=user.id)
                    user_obj.profile_picture_filepath = f"{field_name}/{blob_name}" 
                    user_obj.profile_picture_filetype = file_type
                    user_obj.save()
                return True
            else:
                return False
        except ObjectDoesNotExist:
            raise Http404("The requested user does not exist.")
        except Exception as e:
            raise Exception(e)

    def getUser(self, id):
        user = User.objects.filter(id=id).first()
        if not user:
            raise UserNotFound
        
        groups = []
        for group in user.groups.all():
                groups.append({"id": group.id ,"name":group.name})
        user_res = {
                "id": user.id,
                "email": user.email,
                "first_name":  user.first_name,
                "last_name":  user.last_name,
                "phone_number": user.phone_number,
                "date_joined": user.date_joined,
                "is_active": user.is_active,
                "roles":groups
            }
        return user_res
    
    def updateMyinfo(self, **kwargs):
        user_id = kwargs.get('id')
        user = User.objects.filter(id=user_id).first()
        if user:
            user.first_name = kwargs.get('first_name')
            user.last_name = kwargs.get('last_name')
            user.phone_number = kwargs.get('phone_number')
            # Email cannot be updated here
            with transaction.atomic():
                user.save()
            return user
        else:
            raise UserNotFound
    
    def change_password(self, user, old_password, new_password):
        auth_user = authenticate(username=user.email , password=old_password)
        if auth_user:
            self._check_password_policy(new_password)
            auth_user.password = make_password(new_password)
            auth_user.save()
        else:
            raise UserNotFound
    
    @transaction.atomic()
    def add_branch(self, company_id, data):
        if company_id:
            branch = data['branch']
            address = data['address']
            country = data['country']
            state = data['state']
            city = data['city']

            company_branch = CompanyBranch.objects.create(company=company_id, branch=branch, country=country ,state=state ,city=city ,address=address)
            company_branch.save()
            return company_branch
        else: 
            raise CompanyNotFound

    @transaction.atomic()
    def edit_branch(self, branch_id, data):
        try:
            branch = CompanyBranch.objects.get(id=branch_id)
        except CompanyBranch.DoesNotExist:
            raise ValueError("Branch not found.")
        
        branch.branch = data.get('branch', branch.branch)
        branch.address = data.get('address', branch.address)
        branch.country = data.get('country', branch.country)
        branch.state = data.get('state', branch.state)
        branch.city = data.get('city', branch.city)
        
        branch.save()
        return branch
        
    def list_branch(self, user):
        if user:
            company = User.objects.get(id=user.id).company
            company_branch = CompanyBranch.objects.filter(company=company)
            return company_branch
        else:
            raise UserNotFound
    
    def list_branches(self, user):
        if user:
            company = User.objects.get(id=user.id).company
            company_branch = CompanyBranch.objects.filter(company=company, status=True)
            return company_branch
        else:
            raise UserNotFound
        
    def activateBranchOrDeactivateBranch(self, id, isActivate):
        branch = CompanyBranch.objects.get(id=id)
        if branch:
            branch.status = isActivate
            branch.save()
        else:
            raise BranchNotFound
