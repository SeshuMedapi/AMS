from django.urls import path
from api.view.user_view import LoginView, UserView, RoleView, AdminView, ResetPassword, LogoutView

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
]