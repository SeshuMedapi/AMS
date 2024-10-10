from rest_framework.exceptions import APIException

class ValidationException(Exception):
    "Entity field validation"
    pass

class UserNameConflict(Exception):
    "User email id conflict"
    pass

class CompanyExistException(Exception):
    "Company already registered"