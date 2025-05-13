from .models import CustomUser, ReadingList
from rest_framework import serializers
from apps.book.models import Book

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

class ReadingListSerializer(serializers.ModelSerializer):
    book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())
    class Meta:
        model = ReadingList
        fields = "__all__"
        read_only_fields = ['user']

    def to_representation(self, instance):
        from apps.book.serializer import BookSerializer  # Avoid circular imports
        representation = super().to_representation(instance)
        representation['book'] = BookSerializer(instance.book).data
        return representation

    def create(self, validated_data):
        try:
            # Get the logged-in user from the context
            user = self.context.get('request').user if self.context.get('request') else None

            # Ensure the user is authenticated
            if not user or user.is_anonymous:
                raise serializers.ValidationError("You must be logged in to read a book.")

            # Set the created_by field to the logged-in user
            validated_data['user'] = user
            validated_data['status'] = 'read'

            # Create the book instance
            return super().create(validated_data)

        except Exception as e:
            # Catch any other unexpected errors
            raise serializers.ValidationError(f"An error occurred while creating the book: {str(e)}")

class AuthenticationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=512)
    password = serializers.CharField(max_length=512)

class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=512)
    first_name = serializers.CharField(max_length=512)
    last_name = serializers.CharField(max_length=512)
    email = serializers.CharField(max_length=512)
    password = serializers.CharField(max_length=512)

class TokenVerificationSerializer(serializers.Serializer):
    token = serializers.CharField()

class TokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()