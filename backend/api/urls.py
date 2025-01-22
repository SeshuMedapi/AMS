from django.urls import path
from api.view.user_view import LoginView, UserView, RoleView, AdminView, ResetPassword, LogoutView, ProfilePictureView, BranchView
from api.view.role_view import ActivateRoleview
from api.view.calendar_view import CalendarEventsView
from api.view.notification_view import NotificationView
from api.view.leave_view import LeaveView, LeaveStatusView
from api.view.role_view import AddRoleView, PermissionView
from api.view.punch_view import PunchInView, PunchOutView
from .view.myinfo_view import MyinfoView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("login", LoginView.as_view()),
    path("logout", LogoutView.as_view()),
    path("admin",AdminView.as_view({"get":"get","post":"post"})),
    path('admin/<int:company_id>', AdminView.as_view({'delete': 'delete'})),
    path("user", UserView.as_view({"get":"get","post":"post","put":"put"})),
    path("branch", BranchView.as_view()),
    path("user/activate", UserView.as_view({"post":"activateUser_or_deactivateUser"})),
    path("role/activate", ActivateRoleview.as_view({"post":"activateRole_or_deactivateRole"})),
    path("role/<int:user_id>", RoleView.as_view()),

    path("resetpassword/request", ResetPassword.as_view({'post': 'post_reset_password_request'})),
    path("resetpassword", ResetPassword.as_view({'post': 'post_set_new_password'})),
    path("resetpassword/istokenvalid", ResetPassword.as_view({'post': 'post_is_reset_password_valid'})),

    path('calendar/<int:user_id>', CalendarEventsView.as_view({'get': 'get','post':'post'})),
    path('calendar/delete/<int:event_id>', CalendarEventsView.as_view({'delete':'delete'})),     

    path("profile_picture", ProfilePictureView.as_view()),
    path("myinfo", MyinfoView.as_view({"get":"get", "put":"put"})),
    path("myinfo/changepassword", MyinfoView.as_view({"put":"change_my_password"})),

    path("notification", NotificationView.as_view({"get": "get_notification"})),
    path("notification/read/<int:notification_id>", NotificationView.as_view({"put": "read_notification"})),
    path("notification/read/all", NotificationView.as_view({"put": "read_all_notification"})),
    path("notification/deactive/<int:notification_id>", NotificationView.as_view({"put": "deactive_notification"})),
    path("notification/deactive/all", NotificationView.as_view({"put": "deactive_all_notification"})),

    path("reqstatus", LeaveStatusView.as_view({"get":"get_reqstatus"})),
    path("leavetype", LeaveStatusView.as_view({"get":"get_leavetype"})),

    path("myleave", LeaveView.as_view({"get": "get_myleave"})),
    path("myleave/request", LeaveView.as_view({"post": "request_myleave"})),
    path("requested/leave", LeaveView.as_view({"get": "get_requested_leave"})),
    path("approve/leave", LeaveView.as_view({"post": "approve_leave"})),

    path("newrole/<int:user_id>", AddRoleView.as_view({"get":"get","post":"post"}), name='newrole'),
    path("updaterole/<int:role_id>", AddRoleView.as_view({"put":"put"}), name='update_role'),
    path("permission_list", PermissionView.as_view(), name='permissionlists'),

    path('punch-in', PunchInView.as_view(), name='punch_in'),
    path('punch-out', PunchOutView.as_view(), name='punch_out'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

