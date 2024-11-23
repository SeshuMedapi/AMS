from rest_framework.exceptions import APIException

class ValidationException(Exception):
    "Entity field validation"
    pass

class UserNameConflict(Exception):
    "User email id conflict"
    pass

class CompanyExistException(Exception):
    "Company already registered"

class ResetPasswordTokenExpired(Exception):
    "User password token expired"
    pass

class InvalidResetPasswordToken(Exception):
    """Reset Password Token Invalid"""
    pass

class PasswordPolicyViolation(Exception):
    "If any violation in the password policy"
    pass

class EmailException(Exception):
    '''Email not connected'''
    pass

class PermissionException(Exception):
    pass

class UserNotFound(Exception):
    """User not in the DB"""
    pass