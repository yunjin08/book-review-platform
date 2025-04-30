from .models import Book, Genre, Author
from rest_framework import serializers


class BookSerializer(serializers.ModelSerializer):
    cover_image = serializers.URLField(required=False, allow_null=True)
    class Meta:
        model = Book
        fields = "__all__"
        read_only_fields = ["created_at", "created_by"]


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = "__all__"

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"
