from django.shortcuts import render
from main.utils.generic_api import GenericView
from .models import Review, Comment
from .serializer import ReviewSerializer, CommentSerializer


class ReviewView(GenericView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    # permission_classes = [IsAuthenticated]

class CommentView(GenericView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    # permission_classes = [IsAuthenticated]
