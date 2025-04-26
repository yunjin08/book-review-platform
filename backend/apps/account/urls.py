from django.urls import path
from .views import UserView, AuthenticationView, RegistrationView, ReadingListView

urlpatterns = [
    path("users/", UserView.as_view({"get": "list"}), name="users"),
    path(
        "<int:pk>/reading_list",
        ReadingListView.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
        name="document-detail",
    ),
    path("authenticate/", AuthenticationView.as_view(), name="authentication"),
    path("registration/", RegistrationView.as_view(), name="registration"),
]
