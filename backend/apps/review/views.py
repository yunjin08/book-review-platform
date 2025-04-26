from django.shortcuts import render
from main.utils.generic_api import GenericView
from .models import Review, Comment
from .serializer import ReviewSerializer, CommentSerializer


class ReviewView(GenericView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def pre_create(self, request):
        # Automatically associate reviews with the requesting user
        request.data['user'] = request.user.id
        
    def post_create(self, request, instance):
        # Update user's review count
        instance.user.update_counts()
        
    def post_destroy(self, instance):
        # Update user's review count when a review is deleted
        instance.user.update_counts()
    # permission_classes = [IsAuthenticated]

class CommentView(GenericView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    # permission_classes = [IsAuthenticated]
