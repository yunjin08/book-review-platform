from django.db import transaction
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializer import (
    CustomUserSerializer,
    AuthenticationSerializer,
    RegistrationSerializer,
    ReadingListSerializer,
)
from .utils.jwt import sign_as_jwt
from .models import CustomUser, ReadingList
from apps.review.serializer import ReviewSerializer
from main.utils.generic_api import GenericView
from rest_framework.decorators import action


class UserView(GenericView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    size_per_request = 1000
    @action(detail=True, methods=['get'])

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Get all reviews for a specific user"""
        user = self.get_object()
        reviews = user.reviews.all()  # Assuming you have a related_name='reviews' on your Review model
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def reading_history(self, request, pk=None):
        """Get complete reading history for a user"""
        user = self.get_object()
        reading_lists = user.reading_lists.all()
        serializer = ReadingListSerializer(reading_lists, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def currently_reading(self, request, pk=None):
        """Get books the user is currently reading"""
        user = self.get_object()
        current_books = user.reading_lists.filter(status='currently_reading')
        serializer = ReadingListSerializer(current_books, many=True)
        return Response(serializer.data)

class ReadingListView(GenericView):
    queryset = ReadingList.objects.all()
    serializer_class = ReadingListSerializer
    size_per_request = 1000
    allowed_filter_fields = ['user', 'book', 'status']

    def filter_queryset(self, filters, excludes):
        # Add custom filtering logic if needed
        queryset = super().filter_queryset(filters, excludes)
        
        # Example: If you want to always include some default filtering
        if 'user' not in filters and hasattr(self.request, 'user'):
            queryset = queryset.filter(user=self.request.user)
            
        return queryset

class AuthenticationView(APIView):
    def post(self, request, format=None):
        request_serializer = AuthenticationSerializer(data=request.data)

        if not request_serializer.is_valid():
            return Response(request_serializer.errors, status=400)

        request_data = request_serializer.data

        username = request_data["username"]
        password = request_data["password"]

        print(username, password)

        user = authenticate(username=username, password=password)

        if user is not None:
            payload = {"email": user.email}

            try:
                token = sign_as_jwt(payload)
            except:
                return Response({"error": "Failed JWT Signing"}, status=500)

            user_serializer = CustomUserSerializer(user)

            print(f"{user_serializer.data['username']} successfully authenticated!")
            return Response({"token": token, "user": user_serializer.data})

        else:
            print("Failed Authentication")
            return Response(
                {"error": "Failed Authentication: Incorrect Credentials"}, status=401
            )


class RegistrationView(APIView):
    def post(self, request, format=None):
        request_serializer = RegistrationSerializer(data=request.data)

        if not request_serializer.is_valid():
            return Response(request_serializer.errors, status=400)

        request_data = request_serializer.data
        email = request_data["email"]

        user = None

        try:
            user = CustomUser.objects.get(email=email)
        except Exception as e:
            print("CustomUser Query Error:", e)

        if user is None:
            username = request_data["username"]
            first_name = request_data["first_name"]
            last_name = request_data["last_name"]
            password = request_data["password"]

            user = CustomUser.objects.create_user(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password,
            )

            print(f"Google User {user.username} Successfully Created!")

            return Response({"username": user.username})
        else:
            print(f"User {user.username} Already Exists!")
            return Response({"error": "User already exists"}, status=409)
