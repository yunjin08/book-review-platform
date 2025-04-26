from django.urls import path
from .views import BookView, GenreView, AuthorSerializer

urlpatterns = [
    path(
        "",
        BookView.as_view({"get": "list", "post": "create"}),
        name="document-list",
    ),
    path(
        "<int:pk>/",
        BookView.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
        name="document-detail",
    ),
]
