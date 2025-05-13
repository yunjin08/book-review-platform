from django.urls import path
from .views import BookView, GenreView, AuthorView

urlpatterns = [
    path(
        "genre/",
        GenreView.as_view({"get": "list"}),
        name="genre-list",
    ),
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

# --- PATCH START ---

# Ensure BookView uses object-level permission checks for IDOR prevention.
# We override BookView's get_object (or ensure it's imported as such).
from django.core.exceptions import PermissionDenied
from django.http import Http404

from .models import Book

# Patch BookView to enforce object-level permission checks
from rest_framework import viewsets, permissions

class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of a book to access it.
    """

    def has_object_permission(self, request, view, obj):
        return hasattr(obj, "owner") and obj.owner == request.user

class BookView(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    # Assume authentication is configured globally or per-view.
    # If not, you should also add appropriate authentication_classes.
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_object(self):
        try:
            obj = super().get_object()
        except Http404:
            raise

        # Enforce object-level check
        if hasattr(obj, "owner") and obj.owner == self.request.user:
            return obj
        else:
            raise Http404

# --- PATCH END ---