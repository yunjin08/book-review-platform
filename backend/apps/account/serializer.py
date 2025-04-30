from .models import CustomUser, ReadingList
from rest_framework import serializers


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = "__all__"

class ReadingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingList
        fields = "__all__"

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
    token = serializers.CharField(max_length=2048)
