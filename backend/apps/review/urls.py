from django.urls import path
from .views import ReviewView, CommentView

urlpatterns = [
    path(
        "",
        ReviewView.as_view({"get": "list", "post": "create"}),
        name="document-list",
    ),
    path(
        "<int:pk>/",
        ReviewView.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
        name="document-detail",
    ),
    path(
        "",
        CommentView.as_view({"get": "list", "post": "create"}),
        name="document-list",
    ),
    path(
        "<int:pk>/",
        CommentView.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
        name="document-detail",
    ),
]
