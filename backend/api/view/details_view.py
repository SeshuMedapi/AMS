from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.api_models.users import User
from api.api_models.opertaional_details import OperationalDetails
from ..authentication import PermissionBasedAccess
from ..exception.app_exception import *
from ..services.details_service import DetailService
import logging

class PersonalDetailView(APIView):
    logger = logging.getLogger("app_log")
    
    def get(self, request):
        service = DetailService()
        user_id = request.user.id

        try:
            user = User.objects.get(id=user_id)
            user_data = {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone_number": user.phone_number,
            }
        except User.DoesNotExist:
            user_data = {
                "first_name": None,
                "last_name": None,
                "email": None,
                "phone_number": None,
            }

        personal_details = service.get_details(user_id)

        response_data = {**user_data, **personal_details}

        return Response(response_data, status=status.HTTP_200_OK)

    def put(self, request):
        user_id = request.user.id
        service = DetailService()

        try:
            user_fields = ["first_name", "last_name", "phone_number"]
            user_data = {field: request.data.get(field) for field in user_fields}

            personal_fields = [
                "date_of_birth", "gender", "emergency_contact_name",
                "emergency_contact_relationship", "emergency_contact_number",
                "residential_address", "nationality", "identity_proof_type",
                "identity_proof_number", "marital_status", "educational_qualifications",
                "work_experience", "certifications_skills", "languages_known"
            ]
            personal_data = {field: request.data.get(field) for field in personal_fields}

            missing_fields = [field for field in personal_fields if personal_data[field] is None]
            if missing_fields:
                return Response({"message": f"Missing fields: {', '.join(missing_fields)}"},
                                status=status.HTTP_400_BAD_REQUEST)

            service.update_details(user_id, user_data, personal_data)
            return Response({"message": "Details updated successfully"},
                            status=status.HTTP_200_OK)

        except ValidationException as e:
            return Response({"message": f"Invalid post data: {str(e)}"},
                            status=status.HTTP_400_BAD_REQUEST)
        except UserNameConflict as e:
            return Response({"message": f"Email ID already exists: {str(e)}"},
                            status=status.HTTP_409_CONFLICT)
        except Exception as e:
            self.logger.error(f"Internal Server Error: {str(e)}", exc_info=True)
            return Response({"message": "Internal Server Error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OperationalDetailView(APIView):
    logger = logging.getLogger("app_log")
    permission_classes = [PermissionBasedAccess]
    permission_config = {
        "put" :{
            "permissions" : ["edit_user"],
            "any" : True
        }
    }

    def get(self, request):
        service = DetailService()
        user_id = request.user.id

        try:
            operational_details = service.get_operational_details(user_id)
            return Response(operational_details, status=status.HTTP_200_OK)
        except OperationalDetails.DoesNotExist:
            return Response({"message": "Operational details not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        user_id = request.user.id
        service = DetailService()

        try:
            operational_fields = [
                "reporting_manager","joining_date",
                "work_shift", "associated_projects",
                "role_validity_start", "role_validity_end"
            ]
            operational_data = {field: request.data.get(field) for field in operational_fields}

            missing_fields = [field for field in operational_fields if operational_data[field] is None]
            if missing_fields:
                return Response({"message": f"Missing fields: {', '.join(missing_fields)}"},
                                status=status.HTTP_400_BAD_REQUEST)

            service.update_operational_details(user_id, operational_data)
            return Response({"message": "Operational details updated successfully"},
                            status=status.HTTP_200_OK)

        except ValidationException as e:
            return Response({"message": f"Invalid post data: {str(e)}"},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            self.logger.error(f"Internal Server Error: {str(e)}", exc_info=True)
            return Response({"message": "Internal Server Error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)