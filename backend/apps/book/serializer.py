from .models import Book, Genre, Author
from apps.review.serializer import ReviewSerializer
from rest_framework import serializers


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]


class BookSerializer(serializers.ModelSerializer):
    cover_image = serializers.URLField(required=False, allow_null=True)
    reviews = ReviewSerializer(many=True, read_only=True)  # Include reviews
    genres = GenreSerializer(many=True, read_only=True)  # Use GenreSerializer for genres
    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "genres",
            "description",
            "cover_image",
            "isbn",
            "publication_date",
            "created_by",
            "created_at",
            "updated_at",
            "average_rating",
            "total_reviews",
            "reviews",  # Add reviews to the response
        ]
        read_only_fields = ["created_at", "created_by"]


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"
