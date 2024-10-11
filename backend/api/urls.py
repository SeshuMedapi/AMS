from django.urls import path
from api.view.user_view import LoginView, UserView, RoleView, AdminView

urlpatterns = [
    path("login", LoginView.as_view()),
    path("admin",AdminView.as_view({"post":"post"})),
    path("user", UserView.as_view({"get":"get","post":"post"})),
    path("role/<int:user_id>", RoleView.as_view()),
]