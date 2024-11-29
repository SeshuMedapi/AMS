from django.urls import path
from api.view.user_view import LoginView, UserView, RoleView, AdminView, ResetPassword, LogoutView, ProfilePictureView
from api.view.calendar_view import CalendarEventsView
from api.view.notification_view import NotificationView
from api.view.role_view import AddRoleView, PermissionView
from .view.myinfo_view import MyinfoView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("login", LoginView.as_view()),
    path("logout", LogoutView.as_view()),
    path("admin",AdminView.as_view({"get":"get","post":"post"})),
    path('admin/<int:company_id>', AdminView.as_view({'delete': 'delete'})),
    path("user", UserView.as_view({"get":"get","post":"post"})),
    path("role/<int:user_id>", RoleView.as_view()),

    path("resetpassword/request", ResetPassword.as_view({'post': 'post_reset_password_request'})),
    path("resetpassword", ResetPassword.as_view({'post': 'post_set_new_password'})),
    path("resetpassword/istokenvalid", ResetPassword.as_view({'post': 'post_is_reset_password_valid'})),

    path('calendar/<int:user_id>', CalendarEventsView.as_view({'get': 'get','post':'post'})),
    path('calendar/delete/<int:event_id>', CalendarEventsView.as_view({'delete':'delete'})),     

    path("profile_picture", ProfilePictureView.as_view()),
    path("myinfo", MyinfoView.as_view({"get":"get", "put":"put"})),

    path("notification", NotificationView.as_view({"get": "get_notification"})),
    path("notification/read/<int:notification_id>", NotificationView.as_view({"put": "read_notification"})),
    path("notification/read/all", NotificationView.as_view({"put": "read_all_notification"})),
    path("notification/deactive/<int:notification_id>", NotificationView.as_view({"put": "deactive_notification"})),
    path("notification/deactive/all", NotificationView.as_view({"put": "deactive_all_notification"})),

    path("newrole", AddRoleView.as_view(), name='newrole'),
    path("newrole/<int:role_id>", AddRoleView.as_view(), name='edit_role'),
    path("permission_list", PermissionView.as_view(), name='permissionlists'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

