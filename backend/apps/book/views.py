from main.utils.generic_api import GenericView
from .models import Book
from .serializer import BookSerializer, GenreSerializer, AuthorSerializer

# Create your views here.
class BookView(GenericView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    # permission_classes = [IsAuthenticated]

class GenreView(GenericView):
    queryset = Book.objects.all()
    serializer_class = GenreSerializer
    # permission_classes = [IsAuthenticated]

class AuthorSerializer(GenericView):
    queryset = Book.objects.all()
    serializer_class = AuthorSerializer
    # permission_classes = [IsAuthenticated]



