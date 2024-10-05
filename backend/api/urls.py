from django.urls import path
from api.view.user_view import LoginView, UserView, RoleView

urlpatterns = [
    path("login", LoginView.as_view()),
    path("user", UserView.as_view({"post":"post"})),
    path("role", RoleView.as_view({"get":"get"})),
]