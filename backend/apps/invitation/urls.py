from django.urls import path
from .views import InvitationView

urlpatterns = [
    path(
        "",
        InvitationView.as_view({"get": "list", "post": "create"}),
        name="document-list",
    ),
    path(
        "<int:pk>/",
        InvitationView.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
        name="document-detail",
    ),
]
