from django.db import models
from api.api_models.leave_type import Leavetype
from api.api_models.req_status import Reqstatus
from api.api_models.users import User

class LeaveRequest(models.Model):
    leavetype = models.ForeignKey(Leavetype, on_delete=models.CASCADE)
    startdate = models.DateField() 
    enddate = models.DateField()
    reason = models.TextField()
    status = models.ForeignKey(Reqstatus, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)