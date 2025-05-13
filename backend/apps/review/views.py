from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from main.utils.generic_api import GenericView
from .models import Review, Comment
from .serializer import ReviewSerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Avg

class ReviewView(GenericView):
    queryset = Review.objects.select_related('user', 'book').annotate(
        average_rating=Avg('book__reviews__rating')  # Annotate average_rating
    )
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

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        book = serializer.validated_data.get('book')
        if Review.objects.filter(user=request.user, book=book).exists():
            return Response(
                {"detail": "You have already reviewed this book."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Save while injecting user (since 'user' is read_only)
        instance = serializer.save(user=request.user)

        self.post_create(request, instance)  # Call your custom post-create hook

        response_serializer = self.serializer_class(instance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

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
    
    def get_object(self):
        """Retrieve the review instance based on the primary key (pk)."""
        pk = self.kwargs.get('pk')
        return get_object_or_404(self.queryset, pk=pk)

class CommentView(GenericView):
    queryset = Comment.objects.select_related('user', 'review')
    serializer_class = CommentSerializer

    def pre_update(self, request, instance):
        if instance.user != request.user:
            raise PermissionDenied("You can only edit your own comments")
    
    def pre_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own comments")