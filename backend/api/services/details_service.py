from api.api_models.personal_details import PersonalDetails
from api.api_models.opertaional_details import OperationalDetails
from api.api_models.users import User
import logging

class DetailService:
    logger = logging.getLogger('app_log')

    def get_details(self, user_id):
        try:
            personal_details = PersonalDetails.objects.get(user_id=user_id)
            return {
                "date_of_birth": personal_details.date_of_birth,
                "gender": personal_details.gender,
                "emergency_contact_name": personal_details.emergency_contact_name,
                "emergency_contact_relationship": personal_details.emergency_contact_relationship,
                "emergency_contact_number": personal_details.emergency_contact_number,
                "residential_address": personal_details.residential_address,
                "nationality": personal_details.nationality,
                "identity_proof_type": personal_details.identity_proof_type,
                "identity_proof_number": personal_details.identity_proof_number,
                "marital_status": personal_details.marital_status,
                "educational_qualifications": personal_details.educational_qualifications,
                "work_experience": personal_details.work_experience,
                "certifications_skills": personal_details.certifications_skills,
                "languages_known": personal_details.languages_known,
            }
        except PersonalDetails.DoesNotExist:
            return {
                "date_of_birth": None,
                "gender": None,
                "emergency_contact_name": None,
                "emergency_contact_relationship": None,
                "emergency_contact_number": None,
                "residential_address": None,
                "nationality": None,
                "identity_proof_type": None,
                "identity_proof_number": None,
                "marital_status": None,
                "educational_qualifications": None,
                "work_experience": None,
                "certifications_skills": None,
                "languages_known": None,
            }

    def update_details(self, user_id, user_data, personal_data):
        try:
            User.objects.filter(id=user_id).update(**user_data)
            personal_details, created = PersonalDetails.objects.update_or_create(
                user_id=user_id,
                defaults=personal_data
            )
            return personal_details

        except Exception as e:
            self.logger.error(f"Error updating details: {e}", exc_info=True)
            raise Exception("Error updating personal details")
        
class DetailService:
    logger = logging.getLogger('app_log')

    def get_operational_details(self, user_id):
        try:
            operational_details = OperationalDetails.objects.get(user_id=user_id)
            return {
                "reporting_manager": operational_details.reporting_manager,
                "joining_date": operational_details.joining_date,
                "work_shift": operational_details.work_shift,
                "associated_projects": operational_details.associated_projects,
                "role_validity_start": operational_details.role_validity_start,
                "role_validity_end": operational_details.role_validity_end,
            }
        except OperationalDetails.DoesNotExist:
            return {field: None for field in [
               "reporting_manager","joining_date", "work_shift", "associated_projects",
                "role_validity_start", "role_validity_end"
            ]}

    def update_operational_details(self, user_id, operational_data):
        try:
            operational_details, created = OperationalDetails.objects.update_or_create(
                user_id=user_id,
                defaults=operational_data
            )
            return operational_details

        except Exception as e:
            self.logger.error(f"Error updating operational details: {e}", exc_info=True)
            raise Exception("Error updating operational details")
