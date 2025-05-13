from django.contrib import admin
from django.urls import path, include

# The admin interface is now mapped to a non-default, obscure URL.
# Replace 'mysecureadminpath-82f91d7a/' with your secret path as needed.
urlpatterns = [
    path("mysecureadminpath-82f91d7a/", admin.site.urls),
    path("api/v1/account/", include("apps.account.urls")),
    path("api/v1/book/", include("apps.book.urls")),
    path("api/v1/review/", include("apps.review.urls")),
]