from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/account/", include("apps.account.urls")),
    path("api/v1/book/", include("apps.book.urls")),
    path("api/v1/review/", include("apps.review.urls")),
]
