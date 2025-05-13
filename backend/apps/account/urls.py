from django.urls import path
from .views import UserView, AuthenticationView, RegistrationView, ReadingListView, LogoutView, TokenVerificationView, TokenRefreshView

urlpatterns = [
    path("users/", UserView.as_view({"get": "list"}), name="users"),
    # Only allow access to the authenticated user's own details via 'profile' endpoint
    path("users/profile/", UserView.as_view({"get": "profile"}), name="user-profile"),
    path("users/profile/reviews/", UserView.as_view({"get": "reviews"}), name="user-reviews"),
    path("users/profile/reading_history/", UserView.as_view({"get": "reading_history"}), name="user-reading-history"),
    path("users/profile/currently_reading/", UserView.as_view({"get": "currently_reading"}), name="user-currently-reading"),
    # Endpoints by arbitrary <pk> removed to prevent IDOR vulnerabilities

    # ReadingList endpoints: ensure in the view that only the authenticated user may access their own reading list.
    path(
        "reading_list/<int:pk>/",
        ReadingListView.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
        name="document-detail",
    ),
    path("reading-list/", ReadingListView.as_view({"get": "list", "post": "create"}), name="reading-list-create"),
    path("authenticate/", AuthenticationView.as_view(), name="authentication"),
    path("registration/", RegistrationView.as_view(), name="registration"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("verify-token/", TokenVerificationView.as_view(), name="verify-token"),
    path("refresh-token/", TokenRefreshView.as_view(), name="refresh-token"),
]