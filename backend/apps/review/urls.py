from django.urls import path
from .views import ReviewView, CommentView

urlpatterns = [
    # Review endpoints
    path(
        "reviews/",
        ReviewView.as_view({
            "get": "list", 
            "post": "create"
        }),
        name="review-list",
    ),
    path(
        "reviews/<int:pk>/",
        ReviewView.as_view({
            "get": "retrieve", 
            "put": "update", 
            "delete": "destroy"
        }),
        name="review-detail",
    ),
    path(
        "reviews/<int:pk>/comments/",
        ReviewView.as_view({
            "get": "comments", 
            "post": "add_comment"
        }),
        name="review-comments",
    ),
    
    # Comment endpoints
    path(
        "comments/",
        CommentView.as_view({
            "get": "list", 
            "post": "create"
        }),
        name="comment-list",
    ),
    path(
        "comments/<int:pk>/",
        CommentView.as_view({
            "get": "retrieve", 
            "put": "update", 
            "delete": "destroy"
        }),
        name="comment-detail",
    ),
]