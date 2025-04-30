from main.utils.generic_api import GenericView
from .models import Book, Genre, Author
from .serializer import BookSerializer, GenreSerializer, AuthorSerializer
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class BookView(GenericView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class GenreView(GenericView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class AuthorView(GenericView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer



