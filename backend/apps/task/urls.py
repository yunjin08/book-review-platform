from django.urls import path
from .views import TaskView, TaskGroupView

urlpatterns = [
    path(
        "",
        TaskGroupView.as_view({"get": "list", "post": "create"}),
        name="document-list",
    ),
    path(
        "<int:pk>/",
        TaskGroupView.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
        name="document-detail",
    ),
    path(
        "",
        TaskView.as_view({"get": "list", "post": "create"}),
        name="document-list",
    ),
    path(
        "<int:pk>/",
        TaskView.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
        name="document-detail",
    ),
]
