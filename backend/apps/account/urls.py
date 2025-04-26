from django.urls import path
from .views import UserView, AuthenticationView, RegistrationView

urlpatterns = [
    path("users/", UserView.as_view({"get": "list"}), name="users"),
    path("authenticate/", AuthenticationView.as_view(), name="authentication"),
    path("registration/", RegistrationView.as_view(), name="registration"),
]
