from main.utils.generic_api import GenericView
from .models import Book
from .serializer import BookSerializer, GenreSerializer, AuthorSerializer

# Create your views here.
class BookView(GenericView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class GenreView(GenericView):
    queryset = Book.objects.all()
    serializer_class = GenreSerializer

class AuthorSerializer(GenericView):
    queryset = Book.objects.all()
    serializer_class = AuthorSerializer



