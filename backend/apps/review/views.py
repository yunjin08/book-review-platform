from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from main.utils.generic_api import GenericView
from .models import Review, Comment
from .serializer import ReviewSerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticated



class ReviewView(GenericView):
    queryset = Review.objects.select_related('user', 'book')
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        book_id = self.request.query_params.get('book_id')
        if book_id:
            queryset = queryset.filter(book_id=book_id)
        return queryset

    def pre_create(self, request):
        # Automatically associate reviews with the requesting user
        request.data['user'] = request.user.id
        
    def post_create(self, request, instance):
        # Update user's review count
        instance.user.update_counts()
        
    def pre_destroy(self, instance):
        # Update user's review count when a review is deleted
        instance.user.update_counts()

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        review = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, review=review)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        review = self.get_object()
        comments = review.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

class CommentView(GenericView):
    queryset = Comment.objects.select_related('user', 'review')
    serializer_class = CommentSerializer
    # permission_classes = [IsAuthenticated]

    def pre_update(self, request, instance):
        if instance.user != request.user:
            raise ("You can only edit your own comments")
    
    def pre_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own comments")

