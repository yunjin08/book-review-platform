from .models import Book, Genre, Author
from apps.review.serializer import ReviewSerializer
from rest_framework import serializers
from apps.account.serializer import CustomUserSerializer


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]


class BookSerializer(serializers.ModelSerializer):
    cover_image = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    reviews = ReviewSerializer(many=True, read_only=True) 
     # Include reviews
    genres = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Genre.objects.all(),
        write_only=True
    )
    created_by = CustomUserSerializer(read_only=True)
    genres_detail = GenreSerializer(source='genres', many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)  # Include average_rating
    total_reviews = serializers.IntegerField(read_only=True)  # Include total_reviews

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "genres",
            "genres_detail",
            "description",
            "cover_image",
            "isbn",
            "publication_date",
            "created_by",
            "created_at",
            "updated_at",
            "average_rating",
            "total_reviews",
            "reviews",
            "average_rating",
            "total_reviews",
        ]
        read_only_fields = ["created_at", "created_by"]

    def create(self, validated_data):
        try:
            # Get the logged-in user from the context
            user = self.context.get('request').user if self.context.get('request') else None
            print(user, 'test')

            # Ensure the user is authenticated
            if not user or user.is_anonymous:
                raise serializers.ValidationError("You must be logged in to create a book.")

            # Set the created_by field to the logged-in user
            validated_data['created_by'] = user

            # Create the book instance
            return super().create(validated_data)

        except Exception as e:
            # Catch any other unexpected errors
            raise serializers.ValidationError(f"An error occurred while creating the book: {str(e)}")


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"
