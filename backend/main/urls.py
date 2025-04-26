from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/account/", include("apps.account.urls")),
    path("api/v1/invitation/", include("apps.invitation.urls")),
    path("api/v1/task/", include("apps.task.urls")),
]
