from main.utils.generic_api import GenericView
from .models import Book, Genre, Author
from .serializer import BookSerializer, GenreSerializer, AuthorSerializer
from rest_framework.response import Response
from rest_framework import status
from main.permissions import IsTokenValidated
from django.db.models import Count, Avg


# Create your views here.
class BookView(GenericView):
    queryset = Book.objects.annotate(
        total_reviews=Count('reviews'),  # Annotate total_reviews
        average_rating=Avg('reviews__rating')  # Annotate average_rating
    )
    serializer_class = BookSerializer

    def get_serializer(self, *args, **kwargs):
        # Initialize the serializer with the provided arguments and context
        kwargs['context'] = kwargs.get('context', {})
        kwargs['context']['request'] = self.request
        return self.serializer_class(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        # Explicitly whitelist allowed fields to prevent mass assignment
        ALLOWED_FIELDS = ['title', 'description', 'genre', 'author', 'published_date', 'isbn', 'cover_image']
        allowed_data = {key: value for key, value in request.data.items() if key in ALLOWED_FIELDS}

        serializer = self.get_serializer(data=allowed_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        # Ensure ownership attribution is set securely, do not accept from user input
        serializer.save(owner=self.request.user)

class GenreView(GenericView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class AuthorView(GenericView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer