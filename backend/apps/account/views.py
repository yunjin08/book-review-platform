from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from main.permissions import IsTokenValidated

from rest_framework.permissions import AllowAny
from .serializer import (
    CustomUserSerializer,
    AuthenticationSerializer,
    RegistrationSerializer,
    ReadingListSerializer,
    TokenVerificationSerializer,
    TokenRefreshSerializer,
)
from .models import CustomUser, ReadingList
from apps.review.serializer import ReviewSerializer
from main.utils.generic_api import GenericView
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError


class UserView(GenericView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    size_per_request = 1000
    permission_classes = [IsTokenValidated]
    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        """Get user profile"""
        user = self.get_object()
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

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
    permission_classes = [IsTokenValidated]

    def filter_queryset(self, filters, excludes):
        # Add custom filtering logic if needed
        queryset = super().filter_queryset(filters, excludes)
        
        # Example: If you want to always include some default filtering
        if 'user' not in filters and hasattr(self.request, 'user'):
            queryset = queryset.filter(user=self.request.user)
            
        return queryset

class AuthenticationView(APIView):
    permission_classes = [AllowAny]
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
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)

            user_serializer = CustomUserSerializer(user)

            return Response({
                "token": token, 
                "refresh": str(refresh),
                "user": user_serializer.data
            })

        else:
            print("Failed Authentication")
            return Response(
                {"error": "Failed Authentication: Incorrect Credentials"}, status=401
            )


class RegistrationView(APIView):
    permission_classes = [AllowAny]
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

            # Generate JWT token using SimpleJWT
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)

            # Serialize user data
            user_serializer = CustomUserSerializer(user)

            return Response({
                "token": token,
                "refresh": str(refresh),
                "user": user_serializer.data
            })
        else:
            print(f"User {user.username} Already Exists!")
            return Response({"error": "User already exists"}, status=409)

class LogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        # In JWT, logout is handled client-side by removing the token
        # We can add any server-side cleanup here if needed
        return Response({"message": "Successfully logged out"})

class TokenVerificationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        serializer = TokenVerificationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
            
        token = serializer.validated_data['token']
        
        try:
            # Use SimpleJWT for verification
            access_token = AccessToken(token)
            # Token is valid if no exception is raised
            return Response({"valid": True, "message": "Token is valid"})
        except ExpiredSignatureError:
            return Response({"valid": False, "message": "Token has expired"}, status=401)
        except InvalidTokenError as e:
            return Response({"valid": False, "message": f"Invalid token: {str(e)}"}, status=401)
        except Exception as e:
            return Response({"valid": False, "message": str(e)}, status=401)

class TokenRefreshView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, format=None):
        serializer = TokenRefreshSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
            
        refresh_token = serializer.validated_data['refresh']
        
        try:
            # Create RefreshToken instance from the token string
            refresh = RefreshToken(refresh_token)
            # Generate a new access token
            access_token = str(refresh.access_token)
            
            return Response({
                "access": access_token,
            })
        except ExpiredSignatureError:
            return Response({"error": "Refresh token has expired"}, status=401)
        except InvalidTokenError as e:
            return Response({"error": f"Invalid refresh token: {str(e)}"}, status=401)
        except Exception as e:
            return Response({"error": str(e)}, status=401)
