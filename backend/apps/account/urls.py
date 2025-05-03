from django.urls import path
from .views import UserView, AuthenticationView, RegistrationView, ReadingListView, LogoutView, TokenVerificationView, TokenRefreshView

urlpatterns = [
    path("users/", UserView.as_view({"get": "list"}), name="users"),
    path("users/<int:pk>/", UserView.as_view({"get": "retrieve"}), name="user-detail"),
    path("users/<int:pk>/reviews/", UserView.as_view({"get": "reviews"}), name="user-reviews"),
    path("users/<int:pk>/reading_history/", UserView.as_view({"get": "reading_history"}), name="user-reading-history"),
    path("users/<int:pk>/currently_reading/", UserView.as_view({"get": "currently_reading"}), name="user-currently-reading"),
    path("users/profile/", UserView.as_view({"get": "profile"}), name="user-profile"),
    path(
        "<int:pk>/reading_list",
        ReadingListView.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
        name="document-detail",
    ),
    path("authenticate/", AuthenticationView.as_view(), name="authentication"),
    path("registration/", RegistrationView.as_view(), name="registration"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("verify-token/", TokenVerificationView.as_view(), name="verify-token"),
    path("refresh-token/", TokenRefreshView.as_view(), name="refresh-token"),
]