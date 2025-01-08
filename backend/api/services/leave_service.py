from django.db.models import Q
from api.api_models.leave_request import LeaveRequest
from api.api_models.req_status import Reqstatus
from api.api_models.leave_type import Leavetype

class LeaveService:
    def myleave(self, user):
        try:
            leave_requests = LeaveRequest.objects.filter(user=user).select_related('leavetype', 'status')
            return leave_requests
        except Exception as e:
            raise Exception(f"Error retrieving leave requests: {e}")

    def leavereq(self, user, leave_data):
        try:
            leave_type_id = leave_data.get("leave_type")
            start_date = leave_data.get("start_date")
            end_date = leave_data.get("end_date")
            reason = leave_data.get("reason")

            if not all([leave_type_id, start_date, end_date, reason]):
                raise ValueError("All fields are required to create a leave request.")

            pending_status = Reqstatus.objects.get(status="Pending")
            leavetype_instance = Leavetype.objects.get(id=leave_type_id)
            leave_request = LeaveRequest.objects.create(
                leavetype=leavetype_instance,
                startdate=start_date,
                enddate=end_date,
                reason=reason,
                status=pending_status,
                user=user
            )
            leave_request.save()
            return {
                "message": "Leave request send successfully."
            }
        except Leavetype.DoesNotExist:
            raise ValueError("Invalid leave type ID.")
        except Reqstatus.DoesNotExist:
            raise ValueError("Required status 'Pending' is missing.")
        except Exception as e:
            raise Exception(f"Error creating leave request: {e}")

    def get_requested_leave(self, approver):
        """
        Retrieve all leave requests that require approval.
        """
        try:
            leave_requests = LeaveRequest.objects.filter(
                Q(status__name="Pending")
            ).select_related('leavetype', 'user')
            response = [
                {
                    "id": leave.id,
                    "user": leave.user.username,
                    "leave_type": leave.leavetype.name,
                    "start_date": leave.startdate,
                    "end_date": leave.enddate,
                    "reason": leave.reason,
                    "status": leave.status.name,
                }
                for leave in leave_requests
            ]
            return response
        except Exception as e:
            raise Exception(f"Error retrieving leave requests for approval: {e}")

    def approve_leave(self, leave_id, approver, approve=True):
        """
        Approve or reject a leave request.
        """
        try:
            leave_request = LeaveRequest.objects.get(id=leave_id)
            if leave_request.status.name != "Pending":
                raise ValueError("Leave request is not in a pending state.")

            approved_status = Reqstatus.objects.get(name="Approved")
            rejected_status = Reqstatus.objects.get(name="Rejected")
            leave_request.status = approved_status if approve else rejected_status
            leave_request.save()

            return {
                "message": "Leave request updated successfully.",
                "status": leave_request.status.name,
            }
        except LeaveRequest.DoesNotExist:
            raise ValueError("Leave request not found.")
        except Reqstatus.DoesNotExist:
            raise ValueError("Required status 'Approved' or 'Rejected' is missing.")
        except Exception as e:
            raise Exception(f"Error updating leave request: {e}")
