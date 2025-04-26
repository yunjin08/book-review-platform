from django.db import transaction
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (
    CustomUserSerializer,
    AuthenticationSerializer,
    RegistrationSerializer,
    ReadingListSerializer,
)
from .utils.jwt import sign_as_jwt
from .models import CustomUser, ReadingList
from main.utils.generic_api import GenericView


class UserView(GenericView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    size_per_request = 1000

class ReadingListView(GenericView):
    queryset = ReadingList.objects.all()
    serializer_class = ReadingListSerializer
    size_per_request = 1000

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
