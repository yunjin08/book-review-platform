from .models import Review, Comment
from rest_framework import serializers
from apps.account.serializer import CustomUserSerializer

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ['user', 'username' 'created_at', 'updated_at']

class ReviewSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ['user', 'created_at', 'updated_at', 'comments']
    
    def pre_create(self, request):
    # Automatically associate reviews with the requesting user
        request.data['user'] = request.user.id

    def get_average_rating(self, obj):
        return obj.book.average_rating if hasattr(obj.book, 'average_rating') else None
    
    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value